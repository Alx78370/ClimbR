import pool from "../../db";
import type { Bloc } from "../../../types/bloc";

export default defineEventHandler(async (event): Promise<Bloc[]> => {
  try {
    // Récupérer l'utilisateur connecté
    const userSession = await requireUserSession(event);
    const userId = userSession.user.id;

    const { rows } = await pool.query(
      `
      SELECT b.*, u.username AS owner_username 
      FROM bloc b
      JOIN users u ON u.id = b.user_id
      WHERE b.user_id = $1
      OR b.user_id IN (
        SELECT friend_id FROM friendships WHERE user_id = $1 AND status = 'accepted'
        UNION
        SELECT user_id FROM friendships WHERE friend_id = $1 AND status = 'accepted'
      )
      ORDER BY b.date_validation DESC;
      `,
      [userId],
    );

    return rows as Bloc[];
  } catch (error) {
    console.error("Erreur lors de la requête à la BDD :", error);
    throw error;
  }
});
