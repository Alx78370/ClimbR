import { promises as fs } from "fs";
import { join } from "path";

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);

  if (!formData) {
    return { success: false, error: "Aucun fichier reçu." };
  }

  const file = formData.find((field) => field.name === "file");
  if (!file) {
    return { success: false, error: "Fichier non trouvé dans la requête." };
  }

  const uploadDir = join(process.cwd(), "public/uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  if (!file.filename) {
    return { success: false, error: "Le fichier n'a pas de nom." };
  }
  const filePath = join(uploadDir, file.filename);
  await fs.writeFile(filePath, file.data);

  return { success: true, fileName: `${file.filename}` };
});
