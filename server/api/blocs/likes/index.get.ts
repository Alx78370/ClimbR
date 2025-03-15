import pool from "../../../db";

export default defineEventHandler(async (event) => {
  try {
    const userSession = await requireUserSession(event);
    const userId = userSession.user.id;
    const blocId = getRouterParam(event, "id");

    const { rows } = await pool.query(
      `
      SELECT 
        COUNT(*) AS like_count,
        EXISTS (
          SELECT 1 FROM likes WHERE user_id = $1 AND bloc_id = $2
        ) AS user_has_liked
      FROM likes
      WHERE bloc_id = $2;
      `,
      [userId, blocId],
    );

    return {
      likeCount: parseInt(rows[0].like_count, 10),
      userHasLiked: rows[0].user_has_liked,
    };
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des likes :", error);
    throw error;
  }
});
