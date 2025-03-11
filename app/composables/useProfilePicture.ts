export function useProfilePicture() {
  const { user } = useUserSession();
  const profilePicture = ref<string | null>(user.value?.profilePicture || null);

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
        profilePicture.value = result.filePath;
        return profilePicture.value;
      } else {
        throw new Error(result.error || "Erreur lors de l'upload du fichier");
      }
    } catch (err) {
      console.error("❌ Erreur lors de l'upload :", err);
      return null;
    }
  }

  return {
    profilePicture,
    uploadProfilePicture,
  };
}
