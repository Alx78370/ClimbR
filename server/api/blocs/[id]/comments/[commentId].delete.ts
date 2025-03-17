import pool from "../../../../db";

export default defineEventHandler(async (event) => {
  try {
    const userSession = await requireUserSession(event);
    const userId = userSession.user.id;

    const blocId = getRouterParam(event, "id");
    const commentId = getRouterParam(event, "commentId");

    const client = await pool.connect();

    // ✅ Vérifie si le commentaire existe et qu'il appartient bien à ce bloc
    const { rows: commentRows } = await client.query(
      `SELECT user_id FROM comments WHERE id = $1 AND bloc_id = $2;`,
      [commentId, blocId],
    );

    if (commentRows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Commentaire introuvable ou ne correspond pas à ce bloc",
      });
    }

    const commentOwnerId = commentRows[0].user_id;

    // ✅ Vérifie si le bloc existe et récupère son propriétaire
    const { rows: blocRows } = await client.query(
      `SELECT user_id FROM bloc WHERE id = $1;`,
      [blocId],
    );

    if (blocRows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: "Bloc introuvable" });
    }

    const blocOwnerId = blocRows[0].user_id;

    // ✅ Vérifie si l'utilisateur peut supprimer le commentaire
    if (userId !== commentOwnerId && userId !== blocOwnerId) {
      throw createError({
        statusCode: 403,
        statusMessage: "Vous ne pouvez pas supprimer ce commentaire",
      });
    }

    // ✅ Supprime le commentaire
    await client.query(`DELETE FROM comments WHERE id = $1 AND bloc_id = $2;`, [
      commentId,
      blocId,
    ]);

    client.release();
    return { message: "Commentaire supprimé !" };
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du commentaire :", error);
    throw error;
  }
});
