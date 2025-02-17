import { useRouter } from "vue-router";
import { useFileUpload } from "./useFileUpload";
import type { Bloc } from "../../types/bloc";

export function useBlocForm() {
  const router = useRouter();
  const salleId = ref<number | null>(null);
  const essai = ref<"Flash" | "2-5" | "6-9" | "10+">("Flash");
  const couleur = ref("");
  const titre = ref("");
  const description = ref("");
  const date_validation = ref("");
  const mediaFile = ref<File | null>(null);
  const { mediaFileName, uploadFile } = useFileUpload();

  async function submitBloc() {
    if (mediaFile.value && !mediaFileName.value) {
      await uploadFile(mediaFile.value);
    }

    const blocData = {
      salle_id: salleId.value,
      essai: essai.value,
      couleur: couleur.value,
      titre: titre.value,
      description: description.value,
      media: mediaFileName.value,
      date_validation: date_validation.value,
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
    essai,
    couleur,
    titre,
    description,
    date_validation,
    mediaFile,
    submitBloc,
  };
}
