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
    const { rowCount } = await pool.query(
      `
      DELETE FROM bloc WHERE id = $1
    `,
      [id],
    );

    if (rowCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Bloc introuvable.",
      });
    }

    return {
      success: true,
      message: "Bloc supprimé avec succès.",
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du bloc :", error);
    throw error;
  }
});
