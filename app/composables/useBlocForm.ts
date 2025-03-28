import { useRouter } from "vue-router";
import { useFileUpload } from "./useFileUpload";
import type { Bloc } from "../../types/bloc";
import type { MultiNotificationAwareResponse } from "~~/types/api";
import useSocket from "./useSocket";

export function useBlocForm(blocRef: Ref<Bloc | null>) {
  const router = useRouter();
  const socket = useSocket();

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
  const date_validation = ref(new Date().toISOString().split("T")[0]);
  const mediaFile = ref<File | null>(null);
  const selectedFileName = ref<string>("");
  const { mediaFileName } = useFileUpload();
  const { sendNotification } = useNotifications();

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
    try {
      let uploadedFileName = mediaFileName.value;
      let blocId: number | null = blocRef.value ? blocRef.value.id : null;
      let notifyList: MultiNotificationAwareResponse["notify"] = [];

      const blocData = {
        salle_id: salleId.value,
        essai: essai.value,
        type: type.value,
        couleur: couleur.value,
        titre: titre.value,
        description: description.value,
        media: null,
        date_validation:
          date_validation.value || new Date().toISOString().split("T")[0],
      };

      if (blocRef.value) {
        await $fetch<Bloc>(`/api/blocs/${blocRef.value.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: blocData,
        });
        blocId = blocRef.value.id;
      } else {
        const response = await $fetch<MultiNotificationAwareResponse>(
          "/api/blocs",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: blocData,
          },
        );

        if (!response?.bloc?.id) return;

        blocId = response.bloc.id;
        notifyList = response.notify;
      }

      if (mediaFile.value && blocId) {
        const formData = new FormData();
        formData.append("file", mediaFile.value);
        formData.append("blocId", blocId.toString());

        const response = await $fetch<{ success: boolean; filePath?: string }>(
          "/api/uploads/bloc-picture",
          {
            method: "POST",
            body: formData,
          },
        );

        if (response.success && response.filePath) {
          uploadedFileName = response.filePath;

          await $fetch(`/api/blocs/${blocId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: { media: uploadedFileName },
          });
        }
      }

      const finalBloc = await $fetch<Bloc>(`/api/blocs/${blocId}`);

      if (Array.isArray(notifyList)) {
        for (const n of notifyList) {
          sendNotification({
            receiverId: n.receiverId,
            type: n.type,
            message: n.message,
          });

          socket.emit("newBloc", {
            to: `user_${n.receiverId}`,
            bloc: finalBloc,
          });
        }
      }

      router.push("/");
    } catch (err) {
      console.error("❌ Erreur :", err);
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
