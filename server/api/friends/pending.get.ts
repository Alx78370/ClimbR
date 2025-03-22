import pool from "../../db";

export default defineEventHandler(async (event) => {
  const userSession = await requireUserSession(event);
  const userId = userSession.user.id;

  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `
      SELECT friendships.id,friendships.friend_id AS friend_id, friendships.user_id AS user_id, users.username, users.first_name, users.last_name
      FROM friendships
      JOIN users ON users.id = friendships.friend_id
      WHERE friendships.friend_id = $1 AND friendships.status = 'pending'
      `,
      [userId],
    );

    return rows;
  } finally {
    client.release();
  }
});
