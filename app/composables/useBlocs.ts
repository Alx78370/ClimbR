import type { Bloc } from "../../types/bloc";

export function useBlocs() {
  const blocs = ref<Bloc[]>([]);
  const socket = useSocket();
  const isLoading = ref(true);

  async function fetchBlocs() {
    try {
      blocs.value = await $fetch<Bloc[]>("/api/blocs");
    } catch (error) {
      console.error("Erreur lors du chargement des blocs :", error);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUserBlocs() {
    try {
      blocs.value = await $fetch<Bloc[]>("/api/users/blocs");
    } catch (error) {
      console.error("Erreur lors du chargement de mes blocs :", error);
    } finally {
      isLoading.value = false;
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
        socket.emit("deleteBloc", { blocId: id });
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

  useSocketEvent<Bloc>(
    "newBloc",
    {
      key: "global",
    },
    (bloc: Bloc) => {
      if (!blocs.value.some((b) => b.id === bloc.id)) {
        blocs.value.unshift(bloc);
        console.log("🧱 Bloc reçu en live :", bloc);
      }
    },
  );

  useSocketEvent<{ blocId: number }>(
    "deleteBloc",
    { key: "blocs" },
    ({ blocId }) => {
      blocs.value = blocs.value.filter((b) => b.id !== blocId);
    },
  );

  return {
    blocs,
    isLoading,
    fetchBlocs,
    fetchUserBlocs,
    deleteBloc,
  };
}
