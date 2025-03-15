import pool from "../../../db";

export default defineEventHandler(async (event) => {
  try {
    const userSession = await requireUserSession(event);
    const userId = userSession.user.id;
    const commentId = getRouterParam(event, "id");

    // Vérifier si l'utilisateur est bien l'auteur du commentaire
    const { rows } = await pool.query(
      `SELECT user_id FROM comments WHERE id = $1;`,
      [commentId],
    );

    if (rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Commentaire introuvable",
      });
    }

    if (rows[0].user_id !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage: "Vous ne pouvez pas supprimer ce commentaire",
      });
    }

    // Supprimer le commentaire
    await pool.query(`DELETE FROM comments WHERE id = $1;`, [commentId]);

    return { message: "Commentaire supprimé !" };
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du commentaire :", error);
    throw error;
  }
});
