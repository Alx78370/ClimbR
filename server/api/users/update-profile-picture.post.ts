import { defineEventHandler, readBody } from "h3";
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
    // ✅ Mise à jour en base de données
    await client.query("UPDATE users SET profile_picture = $1 WHERE id = $2", [
      profilePicture,
      session.user.id,
    ]);

    // ✅ Mise à jour immédiate de la session utilisateur
    await setUserSession(event, {
      user: {
        ...session.user,
        profilePicture, // ✅ La session est mise à jour avec la nouvelle photo
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
    client.release(); // ✅ Libération de la connexion PostgreSQL
  }
});
