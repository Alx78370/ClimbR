import pool from "../../../db";
import type { Bloc } from "~~/types/bloc";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID du bloc manquant.",
    });
  }

  try {
    const { rows } = await pool.query(
      `
      SELECT 
        b.*, 
        u.username AS owner_username,
        u.first_name, 
        u.last_name, 
        u.profile_picture,
        s.name AS salle_name,
        lower(TO_CHAR(b.date_validation, 'FMDD TMMonth YYYY')) AS date_validation,
        TO_CHAR(b.created_at, 'DD/MM/YYYY') AS created_at,
        TO_CHAR(b.updated_at, 'DD/MM/YYYY') AS updated_at
      FROM bloc b
      JOIN users u ON u.id = b.user_id
      JOIN salle s ON s.id = b.salle_id
      WHERE b.id = $1
      `,
      [id],
    );

    if (rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Bloc introuvable.",
      });
    }

    return rows[0] as Bloc;
  } catch (error) {
    console.error("Erreur lors de la récupération du bloc :", error);
    throw error;
  }
});
