import pool from "../../db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { receiverId, senderId, type, message } = body;

    // ✅ Vérifie que le destinataire existe
    const { rows: userCheck } = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [receiverId],
    );

    if (userCheck.length === 0) {
      console.error(
        `❌ ERREUR : L'utilisateur cible (receiver_id=${receiverId}) n'existe pas.`,
      );
      return { error: "Utilisateur cible introuvable." };
    }

    // ✅ Crée la notification
    const { rows } = await pool.query(
      `
      INSERT INTO notifications (user_id, sender_id, type, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [receiverId, senderId, type, message],
    );

    return { success: true, notification: rows[0] };
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la notification :", error);
    throw error;
  }
});
