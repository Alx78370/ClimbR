import pool from "../../db";

export default defineEventHandler(async (event) => {
  const userSession = await requireUserSession(event);
  const userId = userSession.user.id;

  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `
            SELECT friendships.id, users.username
            FROM friendships
            JOIN users ON users.id = friendships.user_id
            WHERE friendships.friend_id = $1 AND friendships.status = 'pending'
            `,
      [userId],
    );

    return rows;
  } finally {
    client.release();
  }
});
