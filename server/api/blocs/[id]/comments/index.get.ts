import pool from "../../../../db";

export default defineEventHandler(async (event) => {
  try {
    const blocId = getRouterParam(event, "id");

    const { rows } = await pool.query(
      `
      SELECT c.id, c.content, c.created_at, 
             u.first_name, u.last_name, u.profile_picture
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.bloc_id = $1
      ORDER BY c.created_at DESC;
      `,
      [blocId],
    );

    return rows;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des commentaires :",
      error,
    );
    throw error;
  }
});
