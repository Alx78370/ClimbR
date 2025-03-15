import pool from "../../../../db";

export default defineEventHandler(async (event) => {
  try {
    const userSession = await requireUserSession(event);
    const userId = userSession.user.id;
    const blocId = getRouterParam(event, "id");

    // Récupérer le nombre de likes + état utilisateur
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

    // ✅ Vérifie qu'il y a bien des likes avant d’accéder à `rows[0]`
    const likeCount = rows.length ? parseInt(rows[0].like_count, 10) : 0;
    const userHasLiked = rows.length ? rows[0].user_has_liked : false;

    // Récupérer les 3 derniers utilisateurs ayant liké
    const { rows: likeList } = await pool.query(
      `
      SELECT u.id AS user_id, u.username, u.profile_picture
      FROM likes l
      JOIN users u ON u.id = l.user_id
      WHERE l.bloc_id = $1
      ORDER BY l.created_at DESC
      LIMIT 3;
      `,
      [blocId],
    );

    return {
      likeCount: likeCount,
      userHasLiked: userHasLiked,
      likeList: likeList ?? [],
    };
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des likes :", error);
    throw error;
  }
});
