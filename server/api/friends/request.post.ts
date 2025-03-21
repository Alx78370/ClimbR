import pool from "../../db";
import type { NotificationAwareResponse } from "~~/types/api";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, friendUsername } = body;

  if (!userId || !friendUsername) {
    throw createError({ statusCode: 400, statusMessage: "Données manquantes" });
  }

  const client = await pool.connect();
  try {
    // Trouver l'utilisateur destinataire via son pseudo
    const friendResult = await client.query(
      "SELECT id FROM users WHERE username = $1",
      [friendUsername],
    );

    if (friendResult.rowCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Utilisateur introuvable",
      });
    }

    const friendId = friendResult.rows[0].id;

    // Vérifier si une relation existe déjà
    const existingRequest = await client.query(
      "SELECT * FROM friendships WHERE user_id = $1 AND friend_id = $2",
      [userId, friendId],
    );

    if ((existingRequest.rowCount ?? 0) > 0) {
      return { message: "Demande déjà envoyée ou utilisateur déjà ami." };
    }

    // Créer la demande d'amitié
    await client.query(
      "INSERT INTO friendships (user_id, friend_id, status) VALUES ($1, $2, 'pending')",
      [userId, friendId],
    );

    // Récupérer prénom et nom de l'expéditeur
    const { rows: senderRows } = await client.query(
      "SELECT first_name, last_name FROM users WHERE id = $1",
      [userId],
    );

    const firstName = senderRows[0]?.first_name ?? "";
    const lastName = senderRows[0]?.last_name ?? "";

    // Créer la notification
    await $fetch<NotificationAwareResponse>("/api/notifications/create", {
      method: "POST",
      body: {
        receiverId: friendId,
        senderId: userId,
        type: "friend_request",
        message: `${firstName} ${lastName} vous a envoyé une demande d'ami.`,
      },
    });

    return { message: "Demande d'ami envoyée." };
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la création de la demande d'ami.",
    });
  } finally {
    client.release();
  }
});
