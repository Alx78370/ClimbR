import type { Salle } from "../../types/salle";

export function useSalles() {
  const salles = ref<Salle[]>([]);
  const error = ref<string | null>(null);

  async function fetchSalles() {
    try {
      const data = await $fetch<Salle[]>("/api/salles");
      salles.value = data;
    } catch (err) {
      console.error("Erreur inattendue :", err);
      error.value = "Erreur inattendue lors de la récupération des salles.";
    }
  }

  return {
    salles,
    error,
    fetchSalles,
  };
}
