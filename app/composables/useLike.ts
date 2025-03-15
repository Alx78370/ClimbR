import type { Like, LikeResponse } from "~~/types/like";

export const useLike = (blocId: number) => {
  const likes = ref<number>(0);
  const userHasLiked = ref<boolean>(false);
  const likeList = ref<Like[]>([]);
  const showLikesList = ref<boolean>(false);

  const likeApiUrl = computed(() => `/api/blocs/${blocId}/likes`);

  // Charger le nombre de likes + état de l'utilisateur + utilisateurs ayant liké
  const fetchLikes = async () => {
    try {
      const data = await $fetch<LikeResponse>(likeApiUrl.value);
      likes.value = data.likeCount;
      userHasLiked.value = data.userHasLiked;
      likeList.value = data.likeList ?? [];
    } catch (err) {
      console.error("❌ Erreur lors du chargement des likes :", err);
    }
  };

  // Liker / Unliker un bloc
  const toggleLike = async () => {
    try {
      await $fetch(`${likeApiUrl.value}/toggle`, { method: "POST" });
      await fetchLikes();
    } catch (err) {
      console.error("❌ Erreur lors du toggle du like :", err);
    }
  };

  // Afficher la liste des personnes ayant liké
  const fetchLikeList = async () => {
    showLikesList.value = !showLikesList.value;
  };

  watchEffect(fetchLikes);

  return {
    likes,
    userHasLiked,
    likeList,
    showLikesList,
    fetchLikes,
    toggleLike,
    fetchLikeList,
  };
};
