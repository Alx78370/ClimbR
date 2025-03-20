import pool from "../../../../db";

export default defineEventHandler(async (event) => {
  try {
    const userSession = await requireUserSession(event);
    const userId = userSession.user.id;
    const blocId = getRouterParam(event, "id");

    const client = await pool.connect();
    try {
      // Vérifier si le like existe déjà
      const { rows } = await client.query(
        `SELECT id FROM likes WHERE user_id = $1 AND bloc_id = $2;`,
        [userId, blocId],
      );

      if (rows.length > 0) {
        // Supprimer le like
        await client.query(`DELETE FROM likes WHERE id = $1;`, [rows[0].id]);
        return { message: "Like retiré" };
      } else {
        // Ajouter un like
        await client.query(
          `INSERT INTO likes (user_id, bloc_id) VALUES ($1, $2);`,
          [userId, blocId],
        );

        // Récupérer le propriétaire du bloc
        const { rows: blocRows } = await client.query(
          `SELECT user_id FROM bloc WHERE id = $1;`,
          [blocId],
        );

        if (blocRows.length === 0) {
          console.error("❌ Bloc introuvable, notification annulée.");
          return { message: "Bloc introuvable" };
        }

        const blocOwnerId = blocRows[0].user_id;

        // Récupérer le prénom et nom de l'utilisateur qui like
        const { rows: userRows } = await client.query(
          `SELECT first_name, last_name FROM users WHERE id = $1;`,
          [userId],
        );

        if (userRows.length === 0) {
          console.error("❌ Utilisateur introuvable, notification annulée.");
          return { message: "Utilisateur introuvable" };
        }

        const likerFirstName = userRows[0].first_name;
        const likerLastName = userRows[0].last_name;

        // Vérifier que l'on ne notifie pas soi-même
        if (userId !== blocOwnerId) {
          await client.query(
            `INSERT INTO notifications (user_id, sender_id, type, message)
             VALUES ($1, $2, $3, $4);`,
            [
              blocOwnerId,
              userId,
              "like",
              `${likerFirstName} ${likerLastName} a aimé votre bloc !`,
            ],
          );
        }

        return { message: "Like ajouté" };
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("❌ Erreur lors de la gestion du like :", error);
    throw error;
  }
});
