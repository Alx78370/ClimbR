import pool from "../../db";

export default defineEventHandler(async (event) => {
  try {
    const notificationId = getRouterParam(event, "id");

    await pool.query(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = $1;
      `,
      [notificationId],
    );

    return { success: true };
  } catch (error) {
    console.error(
      "❌ Erreur lors de la mise à jour de la notification :",
      error,
    );
    throw error;
  }
});
