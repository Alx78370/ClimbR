import pool from "../../db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email et mot de passe requis",
    });
  }

  const client = await pool.connect();
  try {
    // Vérifier si l'email existe déjà
    const { rows } = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (rows.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email déjà utilisé",
      });
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Insérer l'utilisateur
    const result = await client.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword],
    );
    const user = result.rows[0];

    // Créer une session utilisateur
    await setUserSession(event, { user });

    return { user };
  } finally {
    client.release();
  }
});
