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

    await pool.query(
      `INSERT INTO comments (user_id, bloc_id, content) VALUES ($1, $2, $3);`,
      [userId, blocId, body.content],
    );

    return { message: "Commentaire ajouté !" };
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du commentaire :", error);
    throw error;
  }
});
