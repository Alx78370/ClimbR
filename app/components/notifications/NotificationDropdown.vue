<script setup lang="ts">
import type { Notification } from "~~/types/notification";
import { getNotificationTitle } from "~~/utils/notificationUtils";
import { useRouter } from "vue-router";

const router = useRouter();
const { notifications, unreadCount, fetchNotifications, markAsRead } =
  useNotifications();
const isOpen = ref<boolean>(false);

onMounted(() => {
  fetchNotifications();
});

const handleHoverNotification = async (notif: Notification) => {
  if (!notif.is_read) {
    await markAsRead(notif.id);
  }
};

const handleNotificationClick = (notif: Notification) => {
  if (notif.type === "friend_request") {
    router.push({ path: "/profile", query: { tab: "requests" } });
  }
};
</script>

<template>
  <div
    class="group relative flex h-full flex-col gap-2 text-white"
    @mouseenter="isOpen = true"
    @mouseleave="isOpen = false"
  >
    <!-- Icône cloche avec animation -->
    <button
      class="relative flex h-full cursor-pointer items-center justify-center border-x-2 border-transparent px-4 py-4 group-hover:border-neutral-900"
    >
      <Icon
        v-if="isOpen"
        name="line-md:bell-filled"
        class="text-4xl text-orange-500"
      />
      <Icon v-else name="line-md:bell-loop" class="text-4xl text-gray-300" />
      <span
        v-if="unreadCount > 0"
        class="absolute top-4 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white"
      >
        {{ unreadCount }}
      </span>
    </button>

    <div
      v-if="isOpen"
      class="absolute -bottom-[1.5px] left-0 z-10 mx-auto h-[1.5px] w-full border-x-2 border-neutral-900 bg-neutral-950"
    ></div>

    <div
      v-if="isOpen"
      class="absolute top-full right-0 flex w-80 flex-col rounded-b border-2 border-neutral-900 bg-neutral-950"
    >
      <ul v-if="notifications.length > 0" class="max-h-96 overflow-y-auto">
        <li
          v-for="notif in notifications"
          :key="notif.id"
          class="relative flex cursor-pointer items-center gap-3 border-b-2 border-neutral-900 px-4 py-3 last:border-transparent hover:bg-neutral-900"
          :class="{ 'bg-neutral-950': !notif.is_read }"
          @mouseenter="handleHoverNotification(notif)"
          @click="handleNotificationClick(notif)"
        >
          <img
            v-if="notif.profile_picture"
            :src="notif.profile_picture"
            alt="Profil"
            class="h-10 w-10 rounded-full"
          />
          <div v-else>
            <Icon name="lucide:circle-user-round" class="text-4xl" />
          </div>
          <div class="flex flex-col items-start">
            <p class="pb-2 text-xs font-bold text-white">
              {{ getNotificationTitle(notif.type) }}
            </p>
            <p class="pb-1 text-start text-xs text-gray-300">
              {{ notif.message }}
            </p>
            <span class="text-xs text-gray-500">{{ notif.created_at }}</span>
          </div>
          <div v-if="!notif.is_read" class="absolute top-2 right-2">
            <Icon
              name="icon-park-outline:dot"
              class="text-xl text-orange-500"
            />
          </div>
        </li>
      </ul>

      <div v-else class="p-4 text-center text-gray-400">
        Aucune notification
      </div>
    </div>
  </div>
</template>
