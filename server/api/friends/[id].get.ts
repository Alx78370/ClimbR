import pool from "../../db";

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
    const friends = await client.query(
      `
            SELECT users.id, users.username FROM friendships
            JOIN users ON (users.id = friendships.friend_id OR users.id = friendships.user_id)
            WHERE (friendships.user_id = $1 OR friendships.friend_id = $1) 
            AND status = 'accepted'
        `,
      [userId],
    );

    return { friends: friends.rows };
  } finally {
    client.release();
  }
});
