import { useRouter } from "vue-router";
import { useFileUpload } from "./useFileUpload";
import type { Bloc } from "../../types/bloc";

export function useBlocForm() {
  const router = useRouter();
  const salleId = ref<number | null>(null);
  const statut = ref<"en cours" | "complété" | "non complété">("en cours");
  const couleur = ref("");
  const note = ref("");
  const mediaFile = ref<File | null>(null);
  const { mediaFileName, uploadFile } = useFileUpload();

  async function submitBloc() {
    if (mediaFile.value && !mediaFileName.value) {
      await uploadFile(mediaFile.value);
    }

    const blocData = {
      salle_id: salleId.value,
      statut: statut.value,
      couleur: couleur.value,
      note: note.value,
      media: mediaFileName.value,
    };

    try {
      const response = await $fetch<Bloc>("/api/blocs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: blocData,
      });

      console.log("Bloc ajouté avec succès :", response);
      router.push("/");
    } catch (err) {
      console.error("Erreur inattendue :", err);
    }
  }

  return {
    salleId,
    statut,
    couleur,
    note,
    mediaFile,
    submitBloc,
  };
}
