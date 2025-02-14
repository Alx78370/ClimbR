import pool from "../db";
import type { Bloc } from "../../types/bloc";

export default defineEventHandler(async (_event): Promise<Bloc[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        b.id,
        b.salle_id,
        b.statut,
        b.couleur,
        b.media,
        b.note,
        TO_CHAR(b.created_at, 'DD/MM/YYYY') AS created_at,
        TO_CHAR(b.updated_at, 'DD/MM/YYYY') AS updated_at,
        s.name AS salle_name
      FROM bloc b
      JOIN salle s ON s.id = b.salle_id;
    `);
    return rows as Bloc[];
  } catch (error) {
    console.error("Erreur lors de la requête à la BDD :", error);
    throw error;
  }
});
