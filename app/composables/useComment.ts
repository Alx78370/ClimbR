import type { Comment } from "~~/types/comment";

export const useComment = (blocId: number) => {
  const comments = useState<Comment[]>(`comments-${blocId}`, () => []);
  const isLoading = ref(false);
  const errorMessage = ref("");

  // ✅ Charger les commentaires avec les nouveaux champs
  const fetchComments = async () => {
    try {
      const data = await $fetch<Comment[]>(`/api/blocs/${blocId}/comments`);

      // ✅ Vérifie si les données reçues contiennent les bons champs
      if (
        data.every(
          (c) => "first_name" in c && "last_name" in c && "content" in c,
        )
      ) {
        comments.value = data;
      } else {
        console.error(
          "❌ Erreur : Les commentaires ne contiennent pas les bons champs !",
        );
      }
    } catch (err) {
      console.error("❌ Erreur lors du chargement des commentaires :", err);
    }
  };

  // ✅ Envoyer un commentaire
  const submitComment = async (content: string) => {
    if (!content.trim()) return;

    isLoading.value = true;
    errorMessage.value = "";

    try {
      await $fetch(`/api/blocs/${blocId}/comments`, {
        method: "POST",
        body: { content },
      });

      await fetchComments();
    } catch (err) {
      errorMessage.value = "Erreur lors de l'envoi du commentaire.";
      console.error("❌ Erreur :", err);
    } finally {
      isLoading.value = false;
    }
  };

  fetchComments();

  return { comments, submitComment, isLoading, errorMessage, fetchComments };
};
