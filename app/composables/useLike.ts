import type { Like, LikeResponse } from "~~/types/like";

export const useLike = (blocId: number) => {
  const likes = useState<number>(`likes-${blocId}`, () => 0);
  const userHasLiked = useState<boolean>(`userHasLiked-${blocId}`, () => false);
  const likeList = useState<Like[]>(`likeList-${blocId}`, () => []);
  const { user } = useUserSession();

  const likeApiUrl = computed(() => `/api/blocs/${blocId}/likes`);

  // Charger le nombre de likes + état utilisateur
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

  // ✅ Mettre à jour immédiatement après un like/unlike
  const toggleLike = async () => {
    try {
      const wasLiked = userHasLiked.value;
      userHasLiked.value = !wasLiked;
      likes.value += wasLiked ? -1 : 1;

      if (!wasLiked) {
        if (user.value) {
          likeList.value.push({
            user_id: user.value.id,
            username: user.value.username,
            profile_picture: user.value.profile_picture || "",
          });
        }
        likeList.value = likeList.value.slice(-3);
      } else {
        likeList.value = likeList.value.filter(
          (u) => u.user_id !== user.value?.id,
        );
      }

      await $fetch(`${likeApiUrl.value}/toggle`, { method: "POST" });
    } catch (err) {
      console.error("❌ Erreur lors du toggle du like :", err);
      userHasLiked.value = !userHasLiked.value;
      likes.value += userHasLiked.value ? 1 : -1;
    }
  };

  watchEffect(fetchLikes);

  return {
    likes,
    userHasLiked,
    likeList,
    toggleLike,
  };
};
