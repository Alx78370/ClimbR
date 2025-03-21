import type { Comment } from "~~/types/comment";
import type { CommentPostResponse } from "~~/types/api";

export const useComment = (blocId: number) => {
  const comments = useState<Comment[]>(`comments-${blocId}`, () => []);
  const { sendNotification } = useNotifications();

  const isLoading = ref(false);
  const errorMessage = ref("");

  // ✅ Charger les commentaires avec les nouveaux champs
  const fetchComments = async () => {
    try {
      const data = await $fetch<Comment[]>(`/api/blocs/${blocId}/comments`);

      if (
        !data.every(
          (c) =>
            "user_id" in c &&
            "first_name" in c &&
            "last_name" in c &&
            "content" in c,
        )
      ) {
        console.error(
          "❌ Erreur : Certains commentaires ne contiennent pas tous les champs requis !",
        );
        return;
      }

      comments.value = data;
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
      const response = await $fetch<CommentPostResponse>(
        `/api/blocs/${blocId}/comments`,
        {
          method: "POST",
          body: { content },
        },
      );

      if (response.notify) {
        sendNotification({
          receiverId: response.notify.receiverId,
          type: response.notify.type,
          message: response.notify.message,
        });
      }

      await fetchComments();
    } catch (err) {
      errorMessage.value = "Erreur lors de l'envoi du commentaire.";
      console.error("❌ Erreur :", err);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      await $fetch(`/api/blocs/${blocId}/comments/${commentId}`, {
        method: "DELETE",
      });
      comments.value = comments.value.filter(
        (comment) => comment.id !== commentId,
      );
    } catch (err) {
      console.error("❌ Erreur lors de la suppression du commentaire :", err);
    }
  };

  fetchComments();

  return {
    comments,
    submitComment,
    isLoading,
    errorMessage,
    fetchComments,
    deleteComment,
  };
};
