<script setup lang="ts">
const props = defineProps<{
  blocId: number;
  autoClose?: boolean;
}>();

const emit = defineEmits<{
  (event: "submit", comment: string): void;
  (event: "cancel"): void;
}>();

const comment = ref("");

const { submitComment, isLoading, errorMessage } = useComment(props.blocId);

const handleSubmit = async () => {
  if (!comment.value.trim()) return;

  await submitComment(comment.value);
  emit("submit", comment.value);
  comment.value = "";

  if (props.autoClose) {
    emit("cancel");
  }
};

const handleCancel = () => {
  comment.value = "";
  emit("cancel");
};
</script>

<template>
  <div class="rounded bg-neutral-800 p-3 shadow-md">
    <textarea
      v-model="comment"
      placeholder="Écrire un commentaire..."
      class="w-full rounded bg-neutral-700 text-white focus:outline-none p-2"
    ></textarea>

    <p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>

    <div class="mt-2 flex justify-end gap-2">
      <button class="cursor-pointer text-gray-300" @click="handleCancel">
        Annuler
      </button>
      <button
        :disabled="isLoading"
        class="cursor-pointer text-orange-500"
        @click="handleSubmit"
      >
        {{ isLoading ? "Envoi..." : "Envoyer" }}
      </button>
    </div>
  </div>
</template>
