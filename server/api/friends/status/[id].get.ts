import pool from "../../../db";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "id");

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID utilisateur requis",
    });
  }

  const client = await pool.connect();
  try {
    const statuses = await client.query(
      `
      SELECT 
        users.id, 
        users.username, 
        friendships.status
      FROM friendships
      JOIN users ON 
        (users.id = friendships.friend_id AND friendships.user_id = $1)
        OR (users.id = friendships.user_id AND friendships.friend_id = $1)
      WHERE users.id != $1;
      `,
      [userId],
    );

    return { statuses: statuses.rows };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statuts d'amitié :",
      error,
    );
    throw createError({
      statusCode: 500,
      statusMessage:
        "Erreur serveur lors de la récupération des statuts d'amitié",
    });
  } finally {
    client.release();
  }
});
