import pool from "../../db";

export default defineEventHandler(async (event) => {
  try {
    const notificationId = getRouterParam(event, "id");

    await pool.query(
      `
      DELETE FROM notifications
      WHERE id = $1;
      `,
      [notificationId],
    );

    return { success: true };
  } catch (error) {
    console.error(
      "❌ Erreur lors de la suppression de la notification :",
      error,
    );
    throw error;
  }
});
