import { promises as fs } from "fs";
import { join, extname } from "path";
import pool from "../../db";
import crypto from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    if (!formData) {
      return { success: false, error: "Aucun fichier reçu." };
    }

    const file = formData.find((field) => field.name === "file");
    const blocIdField = formData.find((field) => field.name === "blocId");
    const blocId = blocIdField ? Number(blocIdField.data.toString()) : null;

    if (!file || !blocId) {
      return { success: false, error: "Fichier ou bloc ID manquant." };
    }

    const uploadDir = join(process.cwd(), "public/uploads/blocs");
    await fs.mkdir(uploadDir, { recursive: true });

    const fileExtension = extname(file.filename || "").toLowerCase();
    const uniqueHash = crypto.randomBytes(6).toString("hex");
    const fileName = `bloc_${blocId}_${uniqueHash}${fileExtension}`;
    const filePath = `/uploads/blocs/${fileName}`;
    const fullFilePath = join(uploadDir, fileName);

    const client = await pool.connect();
    try {
      const checkBloc = await client.query(
        "SELECT id FROM bloc WHERE id = $1",
        [blocId],
      );
      if (checkBloc.rowCount === 0) {
        return { success: false, error: "Le bloc ID spécifié n'existe pas." };
      }

      const result = await client.query(
        "SELECT media FROM bloc WHERE id = $1",
        [blocId],
      );
      const oldMedia = result.rows[0]?.media;

      if (oldMedia && oldMedia.startsWith("/uploads/blocs/")) {
        const oldImagePath = join(
          process.cwd(),
          "public",
          oldMedia.replace(/^\/uploads\//, ""),
        );

        try {
          await fs.access(oldImagePath);
          await fs.unlink(oldImagePath);
        } catch {
          // Ignorer l'erreur si le fichier n'existe pas
        }
      }

      await fs.writeFile(fullFilePath, file.data);
      await client.query(
        "UPDATE bloc SET media = $1 WHERE id = $2 RETURNING media",
        [filePath, blocId],
      );
    } finally {
      client.release();
    }

    return { success: true, filePath };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: `Erreur serveur : ${errorMessage}` };
  }
});
