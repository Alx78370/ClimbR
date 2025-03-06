import pool from "../../db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, friendId } = body;

  if (!userId || !friendId) {
    throw createError({ statusCode: 400, statusMessage: "Données manquantes" });
  }

  const client = await pool.connect();
  try {
    await client.query(
      "UPDATE friendships SET status = 'accepted' WHERE user_id = $1 AND friend_id = $2",
      [friendId, userId],
    );

    return { message: "Demande d'ami acceptée." };
  } finally {
    client.release();
  }
});
