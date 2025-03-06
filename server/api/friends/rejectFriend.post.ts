import pool from "../../db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { friendshipId } = body;

  if (!friendshipId) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID de la demande requis",
    });
  }

  const client = await pool.connect();
  try {
    await client.query("DELETE FROM friendships WHERE id = $1", [friendshipId]);

    return { message: "Demande d'ami refusée" };
  } finally {
    client.release();
  }
});
