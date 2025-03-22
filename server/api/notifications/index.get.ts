import pool from "../../db";
import type { Notification } from "../../../types/notification";

export default defineEventHandler(async (event): Promise<Notification[]> => {
  try {
    // Récupérer l'utilisateur connecté
    const userSession = await requireUserSession(event);
    const userId = userSession.user.id;

    const { rows } = await pool.query(
      `
      SELECT 
        n.*, 
        u.username AS sender_username, 
        u.first_name, 
        u.last_name, 
        u.profile_picture,
        TO_CHAR(n.created_at, 'DD/MM/YYYY HH24:MI') AS created_at
      FROM notifications n
      JOIN users u ON u.id = n.sender_id
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC;
      `,
      [userId],
    );

    return rows as Notification[];
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des notifications :",
      error,
    );
    throw error;
  }
});
