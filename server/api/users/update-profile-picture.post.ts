import { defineEventHandler, readBody } from "h3";
import { promises as fs } from "fs";
import { join } from "path";
import pool from "../../db";
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Utilisateur non authentifié",
    });
  }

  const body = await readBody(event);
  const { profilePicture } = body;

  if (!profilePicture) {
    throw createError({
      statusCode: 400,
      statusMessage: "URL de la photo manquante",
    });
  }

  const client = await pool.connect();
  try {
    // ✅ 1. Récupérer l'ancienne photo de profil de l'utilisateur
    const result = await client.query(
      "SELECT profile_picture FROM users WHERE id = $1",
      [session.user.id],
    );

    const oldProfilePicture = result.rows[0]?.profile_picture;

    // ✅ 2. Supprimer l'ancienne image du serveur (si elle existe et n'est pas l'image par défaut)
    if (
      oldProfilePicture &&
      oldProfilePicture.startsWith("/uploads/profiles/")
    ) {
      const oldImagePath = join(process.cwd(), "public", oldProfilePicture);

      try {
        await fs.unlink(oldImagePath);
        console.log("🗑️ Ancienne photo supprimée :", oldImagePath);
      } catch (error) {
        console.warn("⚠️ Impossible de supprimer l'ancienne photo :", error);
      }
    }

    // ✅ 3. Mettre à jour la BDD avec la nouvelle photo de profil
    await client.query("UPDATE users SET profile_picture = $1 WHERE id = $2", [
      profilePicture,
      session.user.id,
    ]);

    // ✅ 4. Mettre à jour la session utilisateur
    await setUserSession(event, {
      user: {
        ...session.user,
        profilePicture,
      },
    });

    return { success: true, profilePicture };
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de la photo :", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur en base de données",
    });
  } finally {
    client.release();
  }
});
