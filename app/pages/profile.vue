<script setup lang="ts">
import authMiddleware from "../../middleware/auth";
import ProfileTabs from "~/components/profile/ProfileTabs.vue";
import FriendRequests from "~/components/friends/FriendRequests.vue";
import FriendsList from "~/components/friends/FriendsList.vue";
import { useRoute, useRouter } from "vue-router";

const {
  requests,
  friends,
  fetchRequests,
  fetchFriends,
  acceptRequest,
  rejectRequest,
} = useFriends();

const user = useUserSession().user;
const route = useRoute();
const router = useRouter();

const userId = user.value?.id;
const activeTab = ref<"profil" | "requests" | "friends">(
  (route.query.tab as "profil" | "requests" | "friends") || "profil",
);

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab === "requests" || newTab === "friends" || newTab === "profil") {
      activeTab.value = newTab;
    }
  },
);

watch(activeTab, (newTab) => {
  router.replace({ path: "/profile", query: { tab: newTab } });
});

definePageMeta({
  middleware: [authMiddleware],
});

onMounted(async () => {
  await fetchRequests();
  if (userId) {
    await fetchFriends(userId);
  }
});
</script>

<template>
  <div class="flex flex-col items-center p-6">
    <ProfileTabs v-model:active-tab="activeTab" />
    <ProfilePictureUploader v-if="activeTab === 'profil'" />
    <FriendRequests
      v-if="activeTab === 'requests'"
      :requests="requests"
      :accept-request="acceptRequest"
      :reject-request="rejectRequest"
    />
    <FriendsList v-if="activeTab === 'friends'" :friends="friends" />

    <NuxtLink to="/" class="mt-20 text-lg text-orange-500 hover:underline">
      ← Retour à l'accueil
    </NuxtLink>
  </div>
</template>
