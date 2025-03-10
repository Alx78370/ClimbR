import { promises as fs } from "fs";
import { join, extname } from "path";

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event);
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Utilisateur non authentifié",
      });
    }

    const formData = await readMultipartFormData(event);
    if (!formData) {
      return { success: false, error: "Aucun fichier reçu." };
    }

    const file = formData.find((field) => field.name === "file");
    if (!file || !file.filename) {
      return { success: false, error: "Fichier non trouvé dans la requête." };
    }

    const uploadDir = join(process.cwd(), "public/uploads/profiles");
    await fs.mkdir(uploadDir, { recursive: true });

    if (!session.user.first_name || !session.user.last_name) {
      return {
        success: false,
        error: "Le nom et prénom de l'utilisateur sont requis.",
      };
    }

    // ✅ Nettoyage du nom et prénom pour éviter les caractères spéciaux
    const sanitizedFirstName = session.user.first_name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    const sanitizedLastName = session.user.last_name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");

    // ✅ Récupérer l'extension du fichier (ex: .jpg, .png)
    const fileExtension = extname(file.filename).toLowerCase(); // ex: ".jpg"

    // ✅ Générer le nom de fichier avec l'extension d'origine
    const fileName = `${sanitizedLastName}_${sanitizedFirstName}_pp${fileExtension}`;
    const filePath = `/uploads/profiles/${fileName}`;

    // ✅ Enregistrer l'image sur le serveur
    await fs.writeFile(join(uploadDir, fileName), file.data);

    console.log("✅ Image enregistrée :", filePath);

    return { success: true, fileName, filePath };
  } catch (error) {
    console.error("❌ Erreur lors de l'upload :", error);
    return {
      success: false,
      error: "Erreur lors de l'enregistrement du fichier.",
    };
  }
});
