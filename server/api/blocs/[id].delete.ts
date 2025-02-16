import pool from "../../db";
import { promises as fs } from "fs";
import { join } from "path";

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
      SELECT media FROM bloc WHERE id = $1;
    `,
      [id],
    );

    if (rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Bloc introuvable.",
      });
    }

    const mediaPath = rows[0].media;

    const result = await pool.query(
      `
      DELETE FROM bloc WHERE id = $1;
    `,
      [id],
    );

    if (result.rowCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Échec de la suppression du bloc.",
      });
    }

    if (mediaPath) {
      const fullPath = join(process.cwd(), "public/uploads", mediaPath);
      try {
        await fs.unlink(fullPath);
        console.log(`Fichier supprimé : ${fullPath}`);
      } catch (err) {
        if (err instanceof Error) {
          console.error(
            `Erreur lors de la suppression du fichier : ${err.message}`,
          );
        } else {
          console.error(`Erreur lors de la suppression du fichier : ${err}`);
        }
      }
    }

    return {
      success: true,
      message: "Bloc et fichier média supprimés avec succès.",
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du bloc :", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la suppression du bloc.",
    });
  }
});
