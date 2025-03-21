import type { Friend, FriendRequest } from "~~/types/friend";
import type { ApiResponse } from "~~/types/api";

export function useFriends() {
  const requests = ref<FriendRequest[]>([]);
  const friends = ref<Friend[]>([]);
  const friendshipStatus = ref<Record<number, "none" | "pending" | "accepted">>(
    {},
  );
  const message = ref<string>("");

  // ✅ Vérifier le statut d'amitié (retourne 'none', 'pending', ou 'accepted')
  const getFriendshipStatus = (
    userId: number,
  ): "none" | "pending" | "accepted" => {
    return friendshipStatus.value[userId] || "none";
  };

  // ✅ Envoyer une demande d'ami
  const sendFriendRequest = async (
    currentUserId: number,
    friendUsername: string,
  ): Promise<void> => {
    if (!currentUserId || !friendUsername) {
      message.value = "Erreur : données manquantes.";
      return;
    }

    try {
      const response = await $fetch<ApiResponse>("/api/friends/request", {
        method: "POST",
        body: { userId: currentUserId, friendUsername },
      });

      message.value = response.message;
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de la demande d'ami :", error);
      message.value = "Erreur lors de l'envoi de la demande.";
    }
  };

  // Récupérer les demandes d'amis en attente
  const fetchRequests = async (): Promise<void> => {
    try {
      requests.value = await $fetch<FriendRequest[]>("/api/friends/pending");
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des demandes :", error);
    }
  };

  // ✅ Accepter une demande d'ami
  const acceptRequest = async (
    friendshipId: string | number,
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
