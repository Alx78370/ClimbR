<script setup lang="ts">

const props = defineProps<{ blocId: number }>();

const emit = defineEmits<{
    (event: "cancel"): void;
}>();

const comment = ref("");
const { submitComment, isLoading, errorMessage } = useComment(props.blocId);

const handleSubmit = async () => {
    if (!comment.value.trim()) return;

    await submitComment(comment.value);
    comment.value = "";
    emit("cancel");
};
</script>

<template>
    <div class="p-3 bg-neutral-800 rounded shadow-md">
        <textarea v-model="comment" placeholder="Écrire un commentaire..."
            class="w-full p-2 rounded bg-neutral-700 text-white focus:outline-none"></textarea>

        <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

        <div class="flex justify-end gap-2 mt-2">
            <button @click="emit('cancel')" class="text-gray-300 cursor-pointer">Annuler</button>
            <button @click="handleSubmit" :disabled="isLoading" class="text-orange-500 cursor-pointer">
                {{ isLoading ? "Envoi..." : "Envoyer" }}
            </button>
        </div>
    </div>
</template>
