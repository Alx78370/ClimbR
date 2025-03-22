import type { Like, LikeResponse } from "~~/types/like";
import type { NotificationAwareResponse } from "~~/types/api";

export const useLike = (blocId: number) => {
  const likes = useState<number>(`likes-${blocId}`, () => 0);
  const userHasLiked = useState<boolean>(`userHasLiked-${blocId}`, () => false);
  const likeList = useState<Like[]>(`likeList-${blocId}`, () => []);
  const likePreview = useState<Like[]>(`likePreview-${blocId}`, () => []);

  const socket = useSocket();
  const { user } = useUserSession();
  const { sendNotification } = useNotifications();

  const likeApiUrl = computed(() => `/api/blocs/${blocId}/likes`);

  // Charger le nombre de likes + état utilisateur
  const fetchLikes = async () => {
    try {
      const data = await $fetch<LikeResponse>(likeApiUrl.value);
      likes.value = data.likeCount;
      userHasLiked.value = data.userHasLiked;

      // ✅ Limite à 3 pour les avatars
      likePreview.value =
        data.likePreview.map((like) => ({
          user_id: like.user_id,
          username: like.username,
          first_name: like.first_name,
          last_name: like.last_name,
          profile_picture: like.profile_picture || "",
        })) ?? [];

      // ✅ Garde tous les utilisateurs pour le modal
      likeList.value =
        data.likeList.map((like) => ({
          user_id: like.user_id,
          username: like.username,
          first_name: like.first_name,
          last_name: like.last_name,
          profile_picture: like.profile_picture || "",
        })) ?? [];
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

      if (!user.value) return;

      const { id, username, first_name, last_name, profile_picture } =
        user.value;
      const userData = {
        user_id: id,
        username,
        first_name,
        last_name,
        profile_picture: profile_picture || "",
      };

      if (!wasLiked) {
        likeList.value.push(userData);
        likeList.value = likeList.value.slice(-3);

        // ✅ Ajout direct dans likePreview pour l’utilisateur
        if (!likePreview.value.some((u) => u.user_id === userData.user_id)) {
          likePreview.value.unshift(userData);
          likePreview.value = likePreview.value.slice(0, 3);
        }
      } else {
        likeList.value = likeList.value.filter((u) => u.user_id !== id);
        likePreview.value = likePreview.value.filter((u) => u.user_id !== id);
      }

      const response = await $fetch<NotificationAwareResponse>(
        `${likeApiUrl.value}/toggle`,
        { method: "POST" },
      );

      if (response.notify) {
        sendNotification({
          receiverId: response.notify.receiverId,
          type: response.notify.type,
          message: response.notify.message,
        });
      }

      socket.emit("likeBloc", {
        blocId,
        action: wasLiked ? "unlike" : "like",
        userId: id,
        userData,
      });

      console.log("📤 Like envoyé via socket :", blocId);
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
    likePreview,
    toggleLike,
    fetchLikes,
  };
};
