import pool from "../../db";
import type { Bloc } from "../../../types/bloc";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { salle_id, essai, couleur, description, media, date_validation } =
      body;
    if (!salle_id || !essai || !couleur || !date_validation) {
      return {
        success: false,
        error: "Les champs salle_id, essai et couleur sont obligatoires.",
      };
    }

    const { rows } = await pool.query(
      `
      INSERT INTO bloc (salle_id, essai, couleur, media, description, date_validation, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, salle_id, essai, couleur, media, description,
                TO_CHAR(date_validation, 'DD/MM/YYYY') AS date_validation,
                TO_CHAR(created_at, 'DD/MM/YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD/MM/YYYY') AS updated_at;
      `,
      [
        salle_id,
        essai,
        couleur,
        media,
        date_validation || null,
        description || null,
      ],
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
