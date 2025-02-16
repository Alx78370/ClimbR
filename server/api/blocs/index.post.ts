import pool from "../../db";
import type { Bloc } from "../../../types/bloc";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { salle_id, statut, couleur, note, media } = body;
    if (!salle_id || !statut || !couleur) {
      return {
        success: false,
        error: "Les champs salle_id, statut et couleur sont obligatoires.",
      };
    }

    const { rows } = await pool.query(
      `
      INSERT INTO bloc (salle_id, statut, couleur, media, note, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, salle_id, statut, couleur, media, note,
                TO_CHAR(created_at, 'DD/MM/YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD/MM/YYYY') AS updated_at;
      `,
      [salle_id, statut, couleur, media || null, note || null],
    );

    return {
      success: true,
      bloc: rows[0] as Bloc,
    };
  } catch (error) {
    console.error("Erreur lors de l'insertion dans la BDD :", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
});
