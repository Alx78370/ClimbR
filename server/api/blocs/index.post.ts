import pool from "../../db";
import type { Bloc } from "../../../types/bloc";

export default defineEventHandler(async (event) => {
  try {
    // Vérifier si l'utilisateur est connecté
    const userSession = await requireUserSession(event); // Récupère l'utilisateur connecté

    const body = await readBody(event);
    const {
      salle_id,
      essai,
      titre,
      type,
      couleur,
      description,
      media,
      date_validation,
    } = body;

    // Vérification des champs obligatoires
    if (
      !salle_id ||
      !essai ||
      !titre ||
      !type ||
      !couleur ||
      !date_validation
    ) {
      return {
        success: false,
        error:
          "Les champs salle_id, essai, titre, type, couleur et date_validation sont obligatoires.",
      };
    }

    // Insertion du bloc en base de données avec `user_id`
    const { rows } = await pool.query(
      `
      INSERT INTO bloc (salle_id, essai, couleur, media, description, date_validation, type, titre, created_at, updated_at, user_id)
      VALUES ($1, $2, $3, $4, $5, $6::TIMESTAMP, $7, $8, NOW(), NOW(), $9)
      RETURNING id, salle_id, essai, couleur, media, description, type, titre,
                TO_CHAR(date_validation AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS date_validation,
                TO_CHAR(created_at, 'DD/MM/YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD/MM/YYYY') AS updated_at;
      `,
      [
        salle_id,
        essai,
        couleur,
        media || null,
        description || null,
        date_validation,
        type,
        titre,
        userSession.user.id, // Ajoute l'ID de l'utilisateur connecté
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
