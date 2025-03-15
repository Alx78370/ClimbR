export const useComment = (blocId: number) => {
  const isLoading = ref(false);
  const errorMessage = ref("");

  const submitComment = async (content: string) => {
    if (!content.trim()) return;

    isLoading.value = true;
    errorMessage.value = "";

    try {
      await $fetch(`/api/blocs/${blocId}/comments`, {
        method: "POST",
        body: { content },
      });
    } catch (err) {
      errorMessage.value = "Erreur lors de l'envoi du commentaire.";
      console.error("❌ Erreur :", err);
    } finally {
      isLoading.value = false;
    }
  };

  return { submitComment, isLoading, errorMessage };
};
