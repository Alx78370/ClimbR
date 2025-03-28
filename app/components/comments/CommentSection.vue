<script setup lang="ts">
import { useTimeAgo } from "@vueuse/core";
import { capitalizeFirstLetter } from "~~/utils/capitalize";

const props = defineProps<{
  comments: {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  }[];
  blocOwnerId: number;
  deleteComment: (commentId: number) => Promise<void>;
}>();

const { user } = useUserSession();

const formattedComments = computed(() =>
  props.comments
    .slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 2),
);
</script>

<template>
  <div v-if="formattedComments.length > 0" class="mt-4 space-y-3">
    <div
      v-for="comment in formattedComments"
      :key="comment.id"
      class="flex items-start gap-3"
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
        class="text-4xl text-white"
      />

      <div class="group flex-1">
        <div class="flex justify-between">
          <p class="text-sm font-semibold">
            {{ capitalizeFirstLetter(comment.first_name) }}
            {{ capitalizeFirstLetter(comment.last_name) }}
          </p>
          <div class="flex items-center gap-2">
            <p class="text-xs text-gray-400">
              {{
                useTimeAgo(new Date(comment.created_at), {
                  updateInterval: 60000,
                })
              }}
            </p>
            <DeleteCommentButton
              :can-delete="
                !!user &&
                (user.id === comment.user_id || user.id === blocOwnerId)
              "
              :on-delete="() => deleteComment(comment.id)"
            />
          </div>
        </div>
        <p class="mt-1 text-sm">{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>
