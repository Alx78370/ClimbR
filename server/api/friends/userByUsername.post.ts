import pool from "../../db";

export default defineEventHandler(async (event) => {
  try {
    const { username } = await readBody(event);

    if (!username) {
      return { error: "Nom d'utilisateur requis" };
    }

    const { rows } = await pool.query(
      `SELECT id FROM users WHERE username = $1 LIMIT 1;`,
      [username],
    );

    if (rows.length === 0) {
      return { error: "Utilisateur introuvable" };
    }

    return rows[0];
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération de l'utilisateur :",
      error,
    );
    return { error: "Erreur serveur" };
  }
});
