import type { NotificationAwareResponse } from "~~/types/api";
import pool from "../../../../db";

export default defineEventHandler(async (event) => {
  try {
    const userSession = await requireUserSession(event);
    const userId = userSession.user.id;
    const blocId = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: "Le commentaire ne peut pas être vide.",
      });
    }

    const client = await pool.connect();
    try {
      // ✅ Ajouter le commentaire
      const insertResult = await client.query(
        `INSERT INTO comments (user_id, bloc_id, content)
         VALUES ($1, $2, $3)
         RETURNING id, content, created_at;`,
        [userId, blocId, body.content],
      );

      const insertedComment = insertResult.rows[0];

      // ✅ Récupérer les infos utilisateur
      const { rows: userRows } = await client.query(
        `SELECT first_name, last_name, profile_picture FROM users WHERE id = $1;`,
        [userId],
      );

      if (userRows.length === 0) {
        console.error("❌ Utilisateur introuvable, notification annulée.");
        return { message: "Utilisateur introuvable" };
      }

      const { first_name, last_name, profile_picture } = userRows[0];

      // ✅ Récupérer le propriétaire du bloc
      const { rows: blocRows } = await client.query(
        `SELECT user_id FROM bloc WHERE id = $1;`,
        [blocId],
      );

      if (blocRows.length === 0) {
        console.error("❌ Bloc introuvable, notification annulée.");
        return { message: "Bloc introuvable" };
      }

      const blocOwnerId = blocRows[0].user_id;

      const truncatedContent =
        body.content.length > 30
          ? body.content.substring(0, 30) + "..."
          : body.content;

      let notify = null;

      if (userId !== blocOwnerId) {
        await $fetch<NotificationAwareResponse>("/api/notifications/create", {
          method: "POST",
          body: {
            receiverId: blocOwnerId,
            senderId: userId,
            type: "comment",
            message: `${first_name} ${last_name} a commenté votre bloc : "${truncatedContent}".`,
          },
        });

        notify = {
          receiverId: blocOwnerId,
          type: "comment",
          message: `${first_name} ${last_name} a commenté votre bloc : "${truncatedContent}".`,
        };
      }

      return {
        message: "Commentaire ajouté !",
        notify,
        comment: {
          id: insertedComment.id,
          content: insertedComment.content,
          created_at: insertedComment.created_at,
          user_id: userId,
          first_name,
          last_name,
          profile_picture,
        },
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du commentaire :", error);
    throw error;
  }
});
