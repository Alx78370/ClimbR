<script setup lang="ts">
import { useTimeAgo } from "@vueuse/core";

const props = defineProps<{
  comment: {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
  blocOwnerId: number;
  user?: { id: number };
}>();

const emit = defineEmits(["deleteComment"]);

const canDelete =
  props.user &&
  (props.user.id === props.comment.user_id ||
    props.user.id === props.blocOwnerId);

const handleDelete = () => {
  emit("deleteComment", props.comment.id);
};
</script>

<template>
  <div
    class="group flex items-start gap-3 border-b border-neutral-800 pr-3 pb-2"
  >
    <img
      v-if="comment.profile_picture"
      :src="comment.profile_picture"
      alt="profile"
      class="h-8 w-8 rounded-full border border-neutral-900"
    />
    <Icon
      v-else
      name="lucide:circle-user-round"
      class="text-4xl text-gray-500"
    />
    <div class="flex-1">
      <p class="text-sm font-semibold text-white">
        {{ comment.first_name }} {{ comment.last_name }}
      </p>
      <p class="mt-1 text-sm text-gray-300">{{ comment.content }}</p>
    </div>
    <div class="flex items-center gap-2">
      <p class="text-xs text-gray-500">
        {{
          useTimeAgo(new Date(comment.created_at), { updateInterval: 60000 })
        }}
      </p>
      <DeleteCommentButton
        v-if="canDelete"
        :can-delete="canDelete"
        :on-delete="handleDelete"
      />
    </div>
  </div>
</template>
