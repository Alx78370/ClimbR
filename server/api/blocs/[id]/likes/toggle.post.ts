import type { NotificationAwareResponse } from "~~/types/api";
import pool from "../../../../db";

export default defineEventHandler(async (event) => {
  try {
    const userSession = await requireUserSession(event);
    const userId = userSession.user.id;
    const blocId = getRouterParam(event, "id");

    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        `SELECT id FROM likes WHERE user_id = $1 AND bloc_id = $2;`,
        [userId, blocId],
      );

      if (rows.length > 0) {
        await client.query(`DELETE FROM likes WHERE id = $1;`, [rows[0].id]);
        return { message: "Like retiré" };
      } else {
        await client.query(
          `INSERT INTO likes (user_id, bloc_id) VALUES ($1, $2);`,
          [userId, blocId],
        );

        const { rows: blocRows } = await client.query(
          `SELECT user_id FROM bloc WHERE id = $1;`,
          [blocId],
        );

        if (blocRows.length === 0) return { message: "Bloc introuvable" };

        const blocOwnerId = blocRows[0].user_id;

        const { rows: userRows } = await client.query(
          `SELECT first_name, last_name FROM users WHERE id = $1;`,
          [userId],
        );

        if (userRows.length === 0)
          return { message: "Utilisateur introuvable" };

        const likerFirstName = userRows[0].first_name;
        const likerLastName = userRows[0].last_name;

        let notify = null;

        if (userId !== blocOwnerId) {
          await $fetch<NotificationAwareResponse>("/api/notifications/create", {
            method: "POST",
            body: {
              receiverId: blocOwnerId,
              senderId: userId,
              type: "like",
              message: `${likerFirstName} ${likerLastName} a aimé votre bloc !`,
            },
          });

          notify = {
            receiverId: blocOwnerId,
            type: "like",
            message: `${likerFirstName} ${likerLastName} a aimé votre bloc !`,
          };
        }

        return { message: "Like ajouté", notify };
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("❌ Erreur lors du like :", error);
    throw error;
  }
});
