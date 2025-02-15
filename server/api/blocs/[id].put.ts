import pool from "../../db";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);

  const { statut, couleur, note, media } = body;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID du bloc manquant.",
    });
  }

  try {
    const { rows } = await pool.query(
      `
      UPDATE bloc
      SET statut = $1, couleur = $2, note = $3, media = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *;
      `,
      [statut, couleur, note, media || null, id],
    );

    if (rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Bloc introuvable.",
      });
    }

    return {
      success: true,
      bloc: rows[0],
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du bloc :", error);
    throw error;
  }
});
