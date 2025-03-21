import type { ApiResponse } from "~~/types/api";
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
      await client.query(
        `INSERT INTO comments (user_id, bloc_id, content) VALUES ($1, $2, $3);`,
        [userId, blocId, body.content],
      );

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

      // ✅ Récupérer le prénom et nom de l'utilisateur qui commente
      const { rows: userRows } = await client.query(
        `SELECT first_name, last_name FROM users WHERE id = $1;`,
        [userId],
      );

      if (userRows.length === 0) {
        console.error("❌ Utilisateur introuvable, notification annulée.");
        return { message: "Utilisateur introuvable" };
      }

      const firstName = userRows[0].first_name;
      const lastName = userRows[0].last_name;
      const truncatedContent =
        body.content.length > 30
          ? body.content.substring(0, 30) + "..."
          : body.content;

      if (userId !== blocOwnerId) {
        await $fetch<ApiResponse>("/api/notifications/create", {
          method: "POST",
          body: {
            receiverId: blocOwnerId,
            senderId: userId,
            type: "comment",
            message: `${firstName} ${lastName} a commenté votre bloc : "${truncatedContent}".`,
          },
        });
      }

      return { message: "Commentaire ajouté !" };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du commentaire :", error);
    throw error;
  }
});
