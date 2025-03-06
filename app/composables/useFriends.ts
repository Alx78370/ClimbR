import type { Friend, FriendRequest, ApiResponse } from "../../types/friend";

export function useFriends() {
  const requests = ref<FriendRequest[]>([]);
  const friends = ref<Friend[]>([]);
  const message = ref<string>("");

  // Envoyer une demande d'ami
  const sendFriendRequest = async (
    userId: number,
    friendUsername: string,
  ): Promise<void> => {
    if (!friendUsername) {
      message.value = "Veuillez entrer un pseudo.";
      return;
    }

    try {
      const response = await $fetch<ApiResponse>("/api/friends/request", {
        method: "POST",
        body: { userId, friendUsername },
      });

      message.value = response.message;
    } catch {
      message.value = "Erreur lors de l'envoi de la demande.";
    }
  };

  // Récupérer les demandes d'amis en attente
  const fetchRequests = async (): Promise<void> => {
    try {
      requests.value = await $fetch<FriendRequest[]>("/api/friends/pending");
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes :", error);
    }
  };

  // Accepter une demande d'ami
  const acceptRequest = async (friendshipId: number): Promise<void> => {
    try {
      await $fetch<ApiResponse>("/api/friends/acceptFriend", {
        method: "POST",
        body: { friendshipId },
      });

      message.value = "Ami accepté.";
      requests.value = requests.value.filter((r) => r.id !== friendshipId);
    } catch {
      message.value = "Erreur lors de l'acceptation.";
    }
  };

  // Refuser une demande d'ami
  const rejectRequest = async (friendshipId: number): Promise<void> => {
    try {
      await $fetch<ApiResponse>("/api/friends/rejectFriend", {
        method: "POST",
        body: { friendshipId },
      });

      message.value = "Demande refusée.";
      requests.value = requests.value.filter((r) => r.id !== friendshipId);
    } catch {
      message.value = "Erreur lors du refus.";
    }
  };

  // Récupérer la liste des amis
  const fetchFriends = async (userId: number): Promise<void> => {
    try {
      friends.value = await $fetch<Friend[]>(`/api/friends/${userId}`);
    } catch (error) {
      console.error("Erreur lors du chargement des amis :", error);
    }
  };

  return {
    requests,
    friends,
    message,
    sendFriendRequest,
    fetchRequests,
    acceptRequest,
    rejectRequest,
    fetchFriends,
  };
}
