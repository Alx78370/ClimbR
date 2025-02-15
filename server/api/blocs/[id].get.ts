import pool from "../../db";

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
      SELECT * FROM bloc WHERE id = $1
    `,
      [id],
    );

    if (rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Bloc introuvable.",
      });
    }

    return rows[0];
  } catch (error) {
    console.error("Erreur lors de la récupération du bloc :", error);
    throw error;
  }
});
