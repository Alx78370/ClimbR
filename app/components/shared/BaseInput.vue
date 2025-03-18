<script setup lang="ts">
defineProps<{
  modelValue: string;
  type?: string;
  placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <input
    :value="modelValue"
    :type="type || 'text'"
    :placeholder="placeholder"
    class="w-full rounded-xl border-2 border-neutral-800 bg-transparent p-3"
    required
    @input="onInput"
  />
</template>
