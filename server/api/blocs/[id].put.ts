import pool from "../../db";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);

  const { essai, description, media, date_validation, type, titre } = body;
  const couleur = body.couleur ? body.couleur : "inconnu";

  if (!id) {
    return createError({
      statusCode: 400,
      statusMessage: "ID du bloc manquant.",
    });
  }

  try {
    const { rows } = await pool.query(
      `
      UPDATE bloc
      SET essai = $1, couleur = $2, description = $3, media = $4, 
          date_validation = $5::TIMESTAMP, type = $6, titre = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *;
      `,
      [
        essai,
        couleur,
        description || null,
        media || null,
        date_validation ? new Date(date_validation).toISOString() : null,
        type,
        titre,
        id,
      ],
    );

    if (rows.length === 0) {
      return createError({
        statusCode: 404,
        statusMessage: "Bloc introuvable.",
      });
    }

    return {
      success: true,
      bloc: rows[0],
    };
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du bloc :", error as Error);
    return {
      success: false,
      error: `Erreur serveur : ${(error as Error).message}`,
    };
  }
});
