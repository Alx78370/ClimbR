<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  type?: "button" | "submit" | "reset";
}>();
</script>

<template>
  <button
    :type="type || 'button'"
    class="cursor-pointer rounded-xl border-2 border-transparent bg-neutral-800 px-10 py-3 hover:border-neutral-400"
  >
    <slot></slot>
  </button>
</template>
