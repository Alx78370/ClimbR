import { useRouter } from "vue-router";
import { useFileUpload } from "./useFileUpload";
import type { Bloc } from "../../types/bloc";

export function useBlocForm(existingBloc: Bloc | null = null) {
  const router = useRouter();
  const salleId = ref<number | null>(existingBloc?.salle_id || null);
  const essai = ref<"Flash" | "2-5" | "6-9" | "10+">(
    existingBloc?.essai || "Flash",
  );
  const type = ref<
    | "dalle"
    | "vertical"
    | "leger_devers"
    | "gros_devers"
    | "toit"
    | "diedre"
    | "arete"
  >(existingBloc?.type || "dalle");
  const couleur = ref(existingBloc?.couleur || "");
  const titre = ref(existingBloc?.titre || "");
  const description = ref(existingBloc?.description || "");
  const date_validation = ref(existingBloc?.date_validation || "");
  const mediaFile = ref<File | null>(null);
  const { mediaFileName, uploadFile } = useFileUpload();

  if (existingBloc?.media) {
    mediaFileName.value = existingBloc.media;
  }

  async function submitBloc() {
    if (mediaFile.value && !mediaFileName.value) {
      await uploadFile(mediaFile.value);
    }

    const blocData = {
      salle_id: salleId.value,
      essai: essai.value,
      type: type.value,
      couleur: couleur.value,
      titre: titre.value,
      description: description.value,
      media: mediaFileName.value,
      date_validation: date_validation.value,
    };

    try {
      if (existingBloc) {
        await $fetch<Bloc>(`/api/blocs/${existingBloc.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: blocData,
        });
        console.log("Bloc mis à jour avec succès !");
      } else {
        await $fetch<Bloc>("/api/blocs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: blocData,
        });
        console.log("Bloc ajouté avec succès !");
      }
      router.push("/");
    } catch (err) {
      console.error("Erreur :", err);
    }
  }

  return {
    salleId,
    essai,
    type,
    couleur,
    titre,
    description,
    date_validation,
    mediaFile,
    submitBloc,
  };
}
