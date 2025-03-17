import pool from "../../../../db";

export default defineEventHandler(async (event) => {
  try {
    const userSession = await requireUserSession(event);
    const userId = userSession.user.id;
    const blocId = getRouterParam(event, "id");

    // Vérifier si le like existe déjà
    const { rows } = await pool.query(
      `SELECT id FROM likes WHERE user_id = $1 AND bloc_id = $2;`,
      [userId, blocId],
    );

    if (rows.length > 0) {
      // Supprimer le like
      await pool.query(`DELETE FROM likes WHERE id = $1;`, [rows[0].id]);
      return { message: "Like retiré" };
    } else {
      // Ajouter un like
      await pool.query(
        `INSERT INTO likes (user_id, bloc_id) VALUES ($1, $2);`,
        [userId, blocId],
      );
      return { message: "Like ajouté" };
    }
  } catch (error) {
    console.error("❌ Erreur lors de la gestion du like :", error);
    throw error;
  }
});
