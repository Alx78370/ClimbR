<script setup lang="ts">
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { useProfilePicture } from "~/composables/useProfilePicture";

const { uploadProfilePicture } = useProfilePicture();
const fileInput = ref<HTMLInputElement | null>(null);
const image = ref<string | null>(null);
const croppedImage = ref<string | null>(null);
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
    croppedImage.value = canvas.toDataURL("image/jpeg");

    // Convertir en Blob et envoyer au serveur
    canvas.toBlob(async (blob: Blob | null) => {
        if (blob) {
            const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
            await uploadProfilePicture(file);
        }
    }, "image/jpeg");
};

</script>

<template>
    <div class="flex flex-col items-center space-y-4">
        <!-- Affichage de la photo actuelle -->
        <div v-if="croppedImage">
            <img :src="croppedImage" class="w-32 h-32 rounded-full border-2 border-orange-500" />
        </div>

        <!-- Bouton pour sélectionner une nouvelle image -->
        <input type="file" accept="image/*" @change="onFileChange" class="hidden" ref="fileInput" />
        <button @click="fileInput?.click()" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Changer ma photo
        </button>

        <!-- Recadrage de l'image -->
        <div v-if="image" class="cropper-container">
            <Cropper ref="cropper" :src="image" :stencil-props="{ aspectRatio: 1 }" class="cropper" />
            <button @click="cropImage" class="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg">
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