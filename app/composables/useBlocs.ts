import { ref } from "vue";
import type { Bloc } from "../../types/bloc";

export function useBlocs() {
  const blocs = ref<Bloc[]>([]);
  const isLoading = ref(false);

  async function fetchBlocs() {
    try {
      blocs.value = await $fetch<Bloc[]>("/api/blocs");
    } catch (error) {
      console.error("Erreur lors du chargement des blocs :", error);
    }
  }

  async function deleteBloc(id: number) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce bloc ?")) {
      return false;
    }

    try {
      const response = await $fetch<{ success: boolean; message?: string }>(
        `/api/blocs/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.success) {
        blocs.value = blocs.value.filter((bloc) => bloc.id !== id);
        return true;
      } else {
        alert(`Erreur lors de la suppression : ${response.message}`);
        return false;
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du bloc :", error);
      alert("Erreur lors de la suppression. Veuillez réessayer.");
      return false;
    }
  }

  return {
    blocs,
    isLoading,
    fetchBlocs,
    deleteBloc,
  };
}
