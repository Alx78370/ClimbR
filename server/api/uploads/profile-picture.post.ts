import { promises as fs } from "fs";
import { join } from "path";

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    if (!formData) {
      return { success: false, error: "Aucun fichier reçu." };
    }

    const file = formData.find((field) => field.name === "file");
    if (!file) {
      return { success: false, error: "Fichier non trouvé dans la requête." };
    }

    const uploadDir = join(process.cwd(), "public/uploads/profiles");
    await fs.mkdir(uploadDir, { recursive: true });

    if (!file.filename) {
      return { success: false, error: "Le fichier n'a pas de nom." };
    }

    const uniqueFileName = `${Date.now()}_${file.filename}`;
    const filePath = `/uploads/profiles/${uniqueFileName}`;
    await fs.writeFile(join(uploadDir, uniqueFileName), file.data);

    console.log("✅ Fichier enregistré :", filePath);

    return { success: true, fileName: uniqueFileName, filePath };
  } catch (error) {
    console.error("❌ Erreur lors de l'upload :", error);
    return {
      success: false,
      error: "Erreur lors de l'enregistrement du fichier.",
    };
  }
});
