import type { Notification } from "~~/types/notification";

export default function useNotifications() {
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const socket = useSocket();

  const joinRoom = (userId: number) => {
    if (socket.connected) {
      socket.emit("join", userId);
      console.log(`📡 Rejoint la room user_${userId}`);
    } else {
      socket.once("connect", () => {
        socket.emit("join", userId);
        console.log(`📡 (Re)joint la room user_${userId}`);
      });
    }
  };

  const sendNotification = ({
    receiverId,
    type,
    message,
  }: {
    receiverId: number;
    type: string;
    message: string;
  }) => {
    socket.emit("newNotification", {
      to: `user_${receiverId}`,
      data: {
        type,
        message,
        created_at: new Date().toISOString(),
      },
    });
    console.log(`📤 Notification envoyée à user_${receiverId}`);
  };

  const listenForNotifications = () => {
    socket.on("newNotification", async () => {
      console.log("🔔 Nouvelle notification reçue !");
      await fetchNotifications();
    });
  };

  // ✅ Récupérer les notifications depuis la BDD
  const fetchNotifications = async () => {
    try {
      const data = await $fetch<Notification[]>("/api/notifications");

      if (data) {
        notifications.value = data;
        unreadCount.value = data.filter((n) => !n.is_read).length;
      }
    } catch (err) {
      console.error(
        "❌ Erreur lors de la récupération des notifications :",
        err,
      );
    }
  };

  // ✅ Marquer comme lue
  const markAsRead = async (notificationId: number) => {
    try {
      await $fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
      });

      notifications.value = notifications.value.map((notif) =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif,
      );
      unreadCount.value = notifications.value.filter((n) => !n.is_read).length;
    } catch (err) {
      console.error(
        "❌ Erreur lors de la mise à jour de la notification :",
        err,
      );
    }
  };

  // ✅ Supprimer
  const deleteNotification = async (notificationId: number) => {
    try {
      await $fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      notifications.value = notifications.value.filter(
        (notif) => notif.id !== notificationId,
      );
      unreadCount.value = notifications.value.filter((n) => !n.is_read).length;
    } catch (err) {
      console.error(
        "❌ Erreur lors de la suppression de la notification :",
        err,
      );
    }
  };

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    sendNotification,
    listenForNotifications,
    joinRoom,
  };
}
