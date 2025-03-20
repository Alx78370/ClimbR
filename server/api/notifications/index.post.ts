import pool from "../../db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { userId, senderId, type, message } = body;

    const { rows: userCheck } = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [userId],
    );

    if (userCheck.length === 0) {
      console.error(
        `❌ ERREUR : L'utilisateur cible (user_id=${userId}) n'existe pas.`,
      );
      return { error: "Utilisateur cible introuvable." };
    }

    const { rows } = await pool.query(
      `
      INSERT INTO notifications (user_id, sender_id, type, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [userId, senderId, type, message],
    );

    return { success: true, notification: rows[0] };
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la notification :", error);
    throw error;
  }
});
