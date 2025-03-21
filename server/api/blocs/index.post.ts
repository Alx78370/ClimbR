import pool from "../../db";
import type { NotificationAwareResponse } from "~~/types/api";
import type { Bloc } from "../../../types/bloc";

export default defineEventHandler(async (event) => {
  try {
    const userSession = await requireUserSession(event);
    const userId = userSession.user.id;

    const body = await readBody(event);
    const {
      salle_id,
      essai,
      titre,
      type,
      couleur,
      description,
      media,
      date_validation,
    } = body;

    if (
      !salle_id ||
      !essai ||
      !titre ||
      !type ||
      !couleur ||
      !date_validation
    ) {
      return {
        success: false,
        error:
          "Les champs salle_id, essai, titre, type, couleur et date_validation sont obligatoires.",
      };
    }

    const client = await pool.connect();
    try {
      // ➕ Création du bloc
      const { rows } = await client.query(
        `
        INSERT INTO bloc (salle_id, essai, couleur, media, description, date_validation, type, titre, created_at, updated_at, user_id)
        VALUES ($1, $2, $3, $4, $5, $6::TIMESTAMP, $7, $8, NOW(), NOW(), $9)
        RETURNING id, salle_id, essai, couleur, media, description, type, titre,
                  TO_CHAR(date_validation AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS date_validation,
                  TO_CHAR(created_at, 'DD/MM/YYYY') AS created_at,
                  TO_CHAR(updated_at, 'DD/MM/YYYY') AS updated_at;
        `,
        [
          salle_id,
          essai,
          couleur,
          media || null,
          description || null,
          date_validation,
          type,
          titre,
          userId,
        ],
      );

      const createdBloc = rows[0] as Bloc;

      // 👥 Récupérer tous les amis de l'utilisateur
      const { rows: friends } = await client.query(
        `
        SELECT id FROM users
        WHERE id IN (
          SELECT friend_id FROM friendships WHERE user_id = $1 AND status = 'accepted'
          UNION
          SELECT user_id FROM friendships WHERE friend_id = $1 AND status = 'accepted'
        );
        `,
        [userId],
      );

      // 🙋‍♂️ Récupérer prénom et nom de l'utilisateur créateur
      const { rows: userRows } = await client.query(
        "SELECT first_name, last_name FROM users WHERE id = $1",
        [userId],
      );

      const firstName = userRows[0]?.first_name ?? "Un ami";
      const lastName = userRows[0]?.last_name ?? "";

      // 🔔 Envoyer une notification à chaque ami
      for (const friend of friends) {
        await $fetch<NotificationAwareResponse>("/api/notifications/create", {
          method: "POST",
          body: {
            receiverId: friend.id,
            senderId: userId,
            type: "new_bloc",
            message: `${firstName} ${lastName} a publié un nouveau bloc !`,
          },
        });
      }

      return {
        success: true,
        bloc: createdBloc,
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'insertion du bloc ou des notifications :",
      error,
    );
    return {
      success: false,
      error: (error as Error).message,
    };
  }
});
