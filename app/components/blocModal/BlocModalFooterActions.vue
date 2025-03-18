<script setup lang="ts">
defineProps<{
  activeTab: "comments" | "likes";
  blocId: number;
}>();
defineEmits(["commentSubmitted"]);
</script>

<template>
  <div class="pt-3">
    <CommentInput
      v-if="activeTab === 'comments'"
      :bloc-id="blocId"
      :auto-close="false"
      @submit="$emit('commentSubmitted')"
      @cancel="() => {}"
    />
    <SendLikeButton v-else :bloc-id="blocId" />
  </div>
</template>
