<script setup lang="ts">
defineProps<{
  activeTab: "comments" | "likes";
  likesCount: number;
  commentsCount: number;
}>();
const emit = defineEmits(["tabChange"]);

const handleTabChange = (tab: "comments" | "likes") => {
  emit("tabChange", tab);
};
</script>

<template>
  <div class="flex border-b">
    <button
      class="flex-1 cursor-pointer py-2 text-center"
      :class="
        activeTab === 'likes'
          ? 'border-orange-500 text-orange-500'
          : 'text-gray-400'
      "
      @click="handleTabChange('likes')"
    >
      J'aime ({{ likesCount }})
    </button>
    <button
      class="flex-1 cursor-pointer py-2 text-center"
      :class="
        activeTab === 'comments'
          ? 'border-orange-500 text-orange-500'
          : 'text-gray-400'
      "
      @click="handleTabChange('comments')"
    >
      Commentaires ({{ commentsCount }})
    </button>
  </div>
</template>
