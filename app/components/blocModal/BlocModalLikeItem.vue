<script setup lang="ts">
const props = defineProps<{
  like: {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
  user?: { id: number };
  friendshipStatus: "none" | "pending" | "accepted";
}>();
const emit = defineEmits(["sendFriendRequest"]);

const handleSendFriendRequest = () => {
  emit("sendFriendRequest", props.like.username);
};
</script>

<template>
  <div
    class="flex items-center justify-between border-b border-neutral-800 py-2"
  >
    <div class="flex items-center gap-3">
      <img
        v-if="like.profile_picture"
        :src="like.profile_picture"
        alt="profile"
        class="h-8 w-8 rounded-full border border-neutral-900"
      />
      <Icon
        v-else
        name="lucide:circle-user-round"
        class="text-4xl text-gray-500"
      />
      <p class="text-sm text-white">
        {{ like.first_name }} {{ like.last_name }}
      </p>
    </div>
    <button
      v-if="user && like.user_id !== user.id && friendshipStatus === 'none'"
      class="cursor-pointer rounded border border-orange-500 px-2 py-1 text-sm text-orange-500 transition-all duration-300 ease-in-out hover:bg-orange-500 hover:text-white"
      @click="handleSendFriendRequest"
    >
      Devenir ami
    </button>
    <span
      v-else-if="friendshipStatus === 'pending'"
      class="text-gray-400 italic"
    >
      Demande en attente
    </span>
  </div>
</template>
