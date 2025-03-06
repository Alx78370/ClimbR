import pool from "../../db";
import { generateUniqueUsername } from "../../utils/generateUsername";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, firstName, lastName } = body;

  if (!email || !password || !firstName || !lastName) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email, mot de passe, prénom et nom requis",
    });
  }

  const client = await pool.connect();
  try {
    // Vérifier si l'email existe déjà
    const { rowCount } = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );
    if (rowCount && rowCount > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email déjà utilisé",
      });
    }

    // Générer un pseudo unique
    const username = await generateUniqueUsername(firstName, lastName);

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Insérer l'utilisateur
    const result = await client.query(
      "INSERT INTO users (email, password, first_name, last_name, username) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, username",
      [email, hashedPassword, firstName, lastName, username],
    );
    const user = result.rows[0];

    // Créer une session utilisateur
    await setUserSession(event, { user });

    return { user };
  } finally {
    client.release();
  }
});
