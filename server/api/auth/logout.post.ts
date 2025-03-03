export default defineEventHandler(async (event) => {
  await clearUserSession(event);
  return { message: "Déconnecté avec succès" };
});
