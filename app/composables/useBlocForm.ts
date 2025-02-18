import { useRouter } from "vue-router";
import { useFileUpload } from "./useFileUpload";
import type { Bloc } from "../../types/bloc";
import { ref, watch } from "vue";

export function useBlocForm(blocRef: Ref<Bloc | null>) {
  const router = useRouter();
  const salleId = ref<number | null>(null);
  const essai = ref<"Flash" | "2-5" | "6-9" | "10+">("Flash");
  const type = ref<
    | ""
    | "dalle"
    | "vertical"
    | "leger_devers"
    | "gros_devers"
    | "toit"
    | "diedre"
    | "arete"
  >("");
  const couleur = ref("");
  const titre = ref("");
  const description = ref("");
  const date_validation = ref("");
  const mediaFile = ref<File | null>(null);
  const selectedFileName = ref<string>("");
  const { mediaFileName, uploadFile } = useFileUpload();

  watch(
    blocRef,
    (newBloc) => {
      if (newBloc) {
        salleId.value = newBloc.salle_id;
        essai.value = newBloc.essai;
        type.value = newBloc.type;
        couleur.value = newBloc.couleur;
        titre.value = newBloc.titre;
        description.value = newBloc.description ?? "";
        date_validation.value = (newBloc.date_validation?.split("T")[0] ??
          "") as string;

        if (newBloc.media) {
          mediaFileName.value = newBloc.media;
          selectedFileName.value = newBloc.media.split("/").pop() || "";
        }
      }
    },
    { immediate: true },
  );

  async function submitBloc() {
    if (mediaFile.value) {
      const uploadedFileName = await uploadFile(mediaFile.value);
      if (uploadedFileName) {
        mediaFileName.value = uploadedFileName;
      }
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
      if (blocRef.value) {
        await $fetch<Bloc>(`/api/blocs/${blocRef.value.id}`, {
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
    mediaFileName,
    selectedFileName,
    submitBloc,
  };
}
