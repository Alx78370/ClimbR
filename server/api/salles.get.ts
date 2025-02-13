import pool from "../db";
import type { Salle } from "../../types/salle";

export default defineEventHandler(async (_event): Promise<Salle[]> => {
  try {
    const { rows } = await pool.query("SELECT * FROM salle");
    return rows as Salle[];
  } catch (error) {
    console.error("Erreur lors de la requête à la BDD :", error);
    throw error;
  }
});
