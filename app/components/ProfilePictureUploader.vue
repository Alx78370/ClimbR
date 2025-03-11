<script setup lang="ts">
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { useProfilePicture } from "~/composables/useProfilePicture";

const { uploadProfilePicture } = useProfilePicture();
const { user } = useUserSession();

const fileInput = ref<HTMLInputElement | null>(null);
const image = ref<string | null>(null);
const profilePicture = ref<string | null>(user.value?.profilePicture || null);
const cropper = ref<InstanceType<typeof Cropper> | null>(null);

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            image.value = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
};

const cropImage = async () => {
    if (!cropper.value) return;

    const result = cropper.value.getResult();
    if (!result || !result.canvas) {
        console.error("❌ Erreur : Impossible d'obtenir le canvas.");
        return;
    }

    const { canvas } = result;

    canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) {
            console.error("❌ Erreur : Impossible de convertir l'image en Blob.");
            return;
        }

        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        const isUpdate = user.value?.profilePicture !== null;

        const newProfilePicture = await uploadProfilePicture(file, isUpdate);

        if (newProfilePicture) {
            profilePicture.value = newProfilePicture;
            if (user.value) {
                user.value.profilePicture = newProfilePicture;
            }
        }
    }, "image/jpeg");
};

</script>


<template>
    <div class="flex flex-col items-center space-y-4">
        <!-- Placeholder pour sélectionner une nouvelle image -->
        <label for="fileInput"
            class="cursor-pointer relative w-32 h-32 flex items-center justify-center rounded-full border-2 border-gray-400 overflow-hidden">
            <img v-if="profilePicture" :src="profilePicture" class="w-full h-full object-cover" />
            <Icon v-else name="lucide:circle-user-round" class="text-gray-400 text-9xl" />
            <input id="fileInput" type="file" accept="image/*" @change="onFileChange" class="hidden" ref="fileInput" />
        </label>

        <!-- Recadrage de l'image -->
        <div v-if="image" class="cropper-container">
            <Cropper ref="cropper" :src="image" :stencil-props="{ aspectRatio: 1 }" class="cropper" />
            <button @click="cropImage" class="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer">
                Recadrer & Enregistrer
            </button>
        </div>
    </div>
</template>


<style scoped>
.cropper-container {
    width: 300px;
    height: 300px;
    position: relative;
}

.cropper {
    width: 100%;
    height: 100%;
}
</style>