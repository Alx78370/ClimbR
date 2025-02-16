export function useFileUpload() {
  const mediaFileName = ref<string | null>(null);

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        mediaFileName.value = result.fileName;
        return result.fileName;
      } else {
        throw new Error(result.error || "Erreur lors de l'upload du fichier");
      }
    } catch (err) {
      console.error("Erreur lors de l'upload :", err);
      return null;
    }
  }

  return {
    mediaFileName,
    uploadFile,
  };
}
