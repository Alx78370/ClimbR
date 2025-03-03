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
    // Vérifier si l'utilisateur existe
    const { rows } = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (rows.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: "Identifiants invalides",
      });
    }
    const user = rows[0];

    // Vérifier le mot de passe
    const isValid = await verifyPassword(user.password, password);
    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "Identifiants invalides",
      });
    }

    // Créer une session utilisateur
    await setUserSession(event, { user });

    return { user };
  } finally {
    client.release();
  }
});
