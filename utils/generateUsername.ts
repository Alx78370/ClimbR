import pool from "../server/db";

export async function generateUniqueUsername(
  firstName: string,
  lastName: string,
) {
  const baseUsername = `${firstName}${lastName}`.replace(/\s+/g, "");
  let username;
  let isUnique = false;

  const client = await pool.connect();
  try {
    while (!isUnique) {
      const randomTag = Math.floor(1000 + Math.random() * 9000);
      username = `${baseUsername}#${randomTag}`;

      const { rowCount } = await client.query(
        "SELECT id FROM users WHERE username = $1",
        [username],
      );

      if (rowCount === 0) {
        isUnique = true;
      }
    }
  } finally {
    client.release();
  }

  return username;
}
