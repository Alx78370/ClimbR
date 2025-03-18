<script setup lang="ts">
defineProps<{ blocTitle: string }>();
const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <div class="flex items-center justify-between border-b pb-2">
    <h2 class="text-lg font-semibold text-white">{{ blocTitle }}</h2>
    <button @click="closeModal">
      <Icon
        name="ooui:close"
        class="cursor-pointer text-xl text-orange-500 hover:text-orange-400"
      />
    </button>
  </div>
</template>
