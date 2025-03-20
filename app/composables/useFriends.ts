import { capitalizeFirstLetter } from "~~/utils/capitalize";
import type { Friend, FriendRequest } from "~~/types/friend";
import type { ApiResponse } from "~~/types/api";

export function useFriends() {
  const requests = ref<FriendRequest[]>([]);
  const friends = ref<Friend[]>([]);
  const friendshipStatus = ref<Record<number, "none" | "pending" | "accepted">>(
    {},
  );
  const message = ref<string>("");

  const { fetchNotifications } = useNotifications();

  // ✅ Vérifier le statut d'amitié (retourne 'none', 'pending', ou 'accepted')
  const getFriendshipStatus = (
    userId: number,
  ): "none" | "pending" | "accepted" => {
    return friendshipStatus.value[userId] || "none";
  };

  // ✅ Envoyer une demande d'ami et créer une notification
  const sendFriendRequest = async (
    currentUserId: number,
    firstName: string,
    lastName: string,
    friendUsername: string,
    friendId: number,
  ): Promise<void> => {
    if (
      !currentUserId ||
      !firstName ||
      !lastName ||
      !friendUsername ||
      !friendId
    ) {
      console.error("❌ Erreur : Données manquantes", {
        currentUserId,
        firstName,
        lastName,
        friendUsername,
        friendId,
      });
      message.value = "Erreur : données manquantes.";
      return;
    }

    try {
      const response = await $fetch<ApiResponse>("/api/friends/request", {
        method: "POST",
        body: { userId: currentUserId, friendUsername },
      });

      message.value = response.message;

      await $fetch("/api/notifications", {
        method: "POST",
        body: {
          userId: friendId,
          senderId: currentUserId,
          type: "friend_request",
          message: `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)} vous a envoyé une demande d'ami.`,
        },
      });

      fetchNotifications();
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de la demande d'ami :", error);
      message.value = "Erreur lors de l'envoi de la demande.";
    }
  };

  // Récupérer les demandes d'amis en attente
  const fetchRequests = async (): Promise<void> => {
    try {
      const data = await $fetch<FriendRequest[]>("/api/friends/pending");

      requests.value = data.map((req) => ({
        id: req.id,
        friend_id: req.friend_id,
        user_id: req.user_id,
        first_name: req.first_name,
        last_name: req.last_name,
        username: req.username,
      }));
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des demandes :", error);
    }
  };

  // ✅ Accepter une demande d'ami et créer une notification
  const acceptRequest = async (
    friendshipId: string | number,
    user_id: number,
    friend_id: number,
    first_name: string,
    last_name: string,
  ): Promise<void> => {
    try {
      const currentUserId = useUserSession().user.value?.id;
      if (!currentUserId) return;

      await $fetch<ApiResponse>("/api/friends/acceptFriend", {
        method: "POST",
        body: { friendshipId: Number(friendshipId) },
      });

      message.value = "Ami accepté.";
      requests.value = requests.value.filter(
        (r) => r.id !== Number(friendshipId),
      );

      await fetchFriends(currentUserId);

      await $fetch("/api/notifications", {
        method: "POST",
        body: {
          userId: user_id,
          senderId: friend_id,
          type: "friend_accepted",
          message: `${capitalizeFirstLetter(first_name)} ${capitalizeFirstLetter(last_name)} a accepté votre demande d'ami.`,
        },
      });

      fetchNotifications();
    } catch {
      message.value = "Erreur lors de l'acceptation.";
    }
  };

  // Refuser une demande d'ami
  const rejectRequest = async (
    friendshipId: string | number,
  ): Promise<void> => {
    try {
      await $fetch<ApiResponse>("/api/friends/rejectFriend", {
        method: "POST",
        body: { friendshipId: Number(friendshipId) },
      });

      message.value = "Demande refusée.";
      requests.value = requests.value.filter(
        (r) => r.id !== Number(friendshipId),
      );
    } catch {
      message.value = "Erreur lors du refus.";
    }
  };

  // ✅ Récupérer les statuts d'amitié pour l'utilisateur connecté
  const fetchFriendshipStatus = async (userId: number): Promise<void> => {
    try {
      const response = await $fetch<{
        statuses: { id: number; status: "none" | "pending" | "accepted" }[];
      }>(`/api/friends/status/${userId}`);

      // ✅ Transformer en un objet `{ userId: status }` pour accès rapide
      friendshipStatus.value = response.statuses.reduce(
        (acc, friend) => {
          acc[friend.id] = friend.status;
          return acc;
        },
        {} as Record<number, "none" | "pending" | "accepted">,
      );
    } catch (error) {
      console.error(
        "❌ Erreur lors du chargement des statuts d'amitié :",
        error,
      );
    }
  };

  // Récupérer la liste des amis
  const fetchFriends = async (userId: number): Promise<void> => {
    try {
      const response = await $fetch<{
        friends: { id: number; username: string }[];
      }>(`/api/friends/${userId}`);

      friends.value = response.friends;
    } catch (error) {
      console.error("❌ Erreur lors du chargement des amis :", error);
    }
  };

  return {
    requests,
    friends,
    message,
    getFriendshipStatus,
    sendFriendRequest,
    fetchFriendshipStatus,
    fetchRequests,
    acceptRequest,
    rejectRequest,
    fetchFriends,
  };
}
