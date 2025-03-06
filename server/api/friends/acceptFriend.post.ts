import pool from "../../db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { friendshipId } = body;

  if (!friendshipId) {
    throw createError({ statusCode: 400, statusMessage: "Données manquantes" });
  }

  const client = await pool.connect();
  try {
    await client.query(
      "UPDATE friendships SET status = 'accepted' WHERE id = $1",
      [friendshipId],
    );

    return { message: "Demande d'ami acceptée" };
  } finally {
    client.release();
  }
});
