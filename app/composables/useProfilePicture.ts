export function useProfilePicture() {
  const profilePicture = ref<string | null>(null);

  async function uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/uploads/profile-picture", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.filePath) {
        profilePicture.value = result.filePath;

        // Mise à jour de la photo de profil en base + session
        await updateProfilePicture(profilePicture.value);

        return profilePicture.value;
      } else {
        throw new Error(result.error || "Erreur lors de l'upload du fichier");
      }
    } catch (err) {
      console.error("❌ Erreur lors de l'upload :", err);
      return null;
    }
  }

  async function updateProfilePicture(profilePictureUrl: string | null) {
    if (!profilePictureUrl) {
      // ✅ Vérification avant l'appel API
      console.error("❌ Aucune URL de photo de profil fournie.");
      return;
    }

    try {
      const response = await fetch("/api/users/update-profile-picture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profilePicture: profilePictureUrl }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la mise à jour du profil.",
        );
      }
    } catch (err) {
      console.error(
        "❌ Erreur lors de la mise à jour de la photo de profil :",
        err,
      );
    }
  }

  return {
    profilePicture,
    uploadProfilePicture,
  };
}
