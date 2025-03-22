import pool from "../../db";
import type { NotificationAwareResponse } from "~~/types/api";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { friendshipId } = body;

  if (!friendshipId) {
    throw createError({ statusCode: 400, statusMessage: "Données manquantes" });
  }

  const client = await pool.connect();
  try {
    // ✅ Accepter la demande
    const { rows } = await client.query(
      `UPDATE friendships SET status = 'accepted' WHERE id = $1
       RETURNING user_id, friend_id;`,
      [friendshipId],
    );

    if (rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Relation introuvable.",
      });
    }

    const requesterId = rows[0].user_id;
    const accepterId = rows[0].friend_id;

    // ✅ Récupérer prénom et nom de celui qui accepte
    const { rows: userRows } = await client.query(
      "SELECT first_name, last_name FROM users WHERE id = $1",
      [accepterId],
    );

    if (userRows.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: "Accepteur introuvable.",
      });
    }

    const firstName = userRows[0]?.first_name ?? "";
    const lastName = userRows[0]?.last_name ?? "";

    const message = `${firstName} ${lastName} a accepté votre demande d'ami.`;

    // ✅ Créer la notification dans la BDD
    await $fetch<NotificationAwareResponse>("/api/notifications/create", {
      method: "POST",
      body: {
        receiverId: requesterId,
        senderId: accepterId,
        type: "friend_accepted",
        message,
      },
    });

    // ✅ Retourner notify pour émission client
    return {
      message: "Demande d'ami acceptée",
      notify: {
        receiverId: requesterId,
        type: "friend_accepted",
        message,
      },
    };
  } catch (err) {
    console.error("❌ Erreur lors de l'acceptation de la demande :", err);
    throw err;
  } finally {
    client.release();
  }
});
