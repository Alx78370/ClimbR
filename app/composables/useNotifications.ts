import type { Notification } from "~~/types/notification";

export default function useNotifications() {
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);

  // ✅ Récupérer les notifications avec $fetch()
  const fetchNotifications = async () => {
    try {
      const data = await $fetch<Notification[]>("/api/notifications");

      if (data) {
        notifications.value = data;
        unreadCount.value = notifications.value.filter(
          (n) => !n.is_read,
        ).length;
      }
    } catch (err) {
      console.error(
        "❌ Erreur lors de la récupération des notifications :",
        err,
      );
    }
  };

  // ✅ Marquer une notification comme lue
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

  // ✅ Supprimer une notification
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
  };
}
