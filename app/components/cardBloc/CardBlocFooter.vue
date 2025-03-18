<script setup lang="ts">
defineProps<{
  blocId: number;
  blocTitle: string;
  blocOwnerId: number;
  commentCount: number;
  likeCount: number;
  isCommenting: boolean;
}>();

defineEmits<{
  (event: "toggleComment"): void;
}>();
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-start gap-3">
      <LikeToggleButton :bloc-id="blocId" />
      <CommentButton
        :is-commenting="isCommenting"
        @toggle-comment="$emit('toggleComment')"
      />
    </div>
    <div class="flex items-center gap-2">
      <LikeDisplay
        :bloc-id="blocId"
        :bloc-title="blocTitle"
        :bloc-owner-id="blocOwnerId"
      />
      <span
        v-if="commentCount > 0 && likeCount > 0"
        class="text-xl font-bold opacity-70"
        >·</span
      >
      <CommentDisplay
        :bloc-id="blocId"
        :bloc-title="blocTitle"
        :bloc-owner-id="blocOwnerId"
        :comment-count="commentCount"
        hide-if-empty
      />
    </div>
  </div>
</template>
