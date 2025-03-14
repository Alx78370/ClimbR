export function useProfilePicture() {
  const { user } = useUserSession();
  const profile_picture = ref<string | null>(
    user.value?.profile_picture || null,
  );

  async function uploadProfilePicture(file: File, isUpdate: boolean = false) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await globalThis.fetch(
        `/api/uploads/${isUpdate ? "update-profile-picture" : "profile-picture"}`,
        {
          method: isUpdate ? "PUT" : "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (result.success && result.filePath) {
        profile_picture.value = result.filePath;
        return profile_picture.value;
      } else {
        throw new Error(result.error || "Erreur lors de l'upload du fichier");
      }
    } catch (err) {
      console.error("❌ Erreur lors de l'upload :", err);
      return null;
    }
  }

  return {
    profile_picture,
    uploadProfilePicture,
  };
}
