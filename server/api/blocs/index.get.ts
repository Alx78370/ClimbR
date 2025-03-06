import pool from "../../db";
import type { Bloc } from "../../../types/bloc";

export default defineEventHandler(async (event): Promise<Bloc[]> => {
  try {
    // Récupérer l'utilisateur connecté
    const userSession = await requireUserSession(event);
    const userId = userSession.user.id;

    const { rows } = await pool.query(
      `
      SELECT 
        b.*, 
        u.username AS owner_username,
        u.first_name, 
        u.last_name, 
        s.name AS salle_name,
        lower(TO_CHAR(b.date_validation, 'FMDD TMMonth YYYY')) AS date_validation,
        TO_CHAR(b.created_at, 'DD/MM/YYYY') AS created_at,
        TO_CHAR(b.updated_at, 'DD/MM/YYYY') AS updated_at
      FROM bloc b
      JOIN users u ON u.id = b.user_id
      JOIN salle s ON s.id = b.salle_id
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
    console.error("❌ Erreur lors de la requête à la BDD :", error);
    throw error;
  }
});
