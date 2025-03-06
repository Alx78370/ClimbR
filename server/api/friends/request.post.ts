import pool from "../../db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, friendUsername } = body;

  if (!userId || !friendUsername) {
    throw createError({ statusCode: 400, statusMessage: "Données manquantes" });
  }

  const client = await pool.connect();
  try {
    // Trouver l'ID de l'ami via son pseudo
    const friendResult = await client.query(
      "SELECT id FROM users WHERE username = $1",
      [friendUsername],
    );

    if (friendResult.rowCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Utilisateur introuvable",
      });
    }

    const friendId = friendResult.rows[0].id;

    // Vérifier si une relation existe déjà
    const existingRequest = await client.query(
      "SELECT * FROM friendships WHERE user_id = $1 AND friend_id = $2",
      [userId, friendId],
    );

    if (existingRequest.rowCount !== null && existingRequest.rowCount > 0) {
      return { message: "Demande déjà envoyée ou utilisateur déjà ami." };
    }

    // Ajouter la relation
    await client.query(
      "INSERT INTO friendships (user_id, friend_id, status) VALUES ($1, $2, 'pending')",
      [userId, friendId],
    );

    return { message: "Demande d'ami envoyée." };
  } finally {
    client.release();
  }
});
