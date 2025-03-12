<script setup lang="ts">
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { useProfilePicture } from "~/composables/useProfilePicture";

const { uploadProfilePicture } = useProfilePicture();
const { user } = useUserSession(); // ❌ Supprime `fetch`
const fileInput = ref<HTMLInputElement | null>(null);
const image = ref<string | null>(null);
const profilePicture = computed(() => user.value?.profilePicture || null);
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
            console.log("✅ Nouvelle image enregistrée :", newProfilePicture);

            if (user.value) {
                user.value.profilePicture = newProfilePicture;
            }

            image.value = null;
        }
    }, "image/jpeg");
};
</script>

<template>
    <div class="flex flex-col items-center">
        <!-- Placeholder pour sélectionner une nouvelle image -->
        <div class="group relative">
            <label for="fileInput"
                class="cursor-pointer relative w-32 h-32 flex items-center justify-center rounded-full border-2 border-neutral-900 overflow-hidden mt-10">
                <img v-if="profilePicture" :src="profilePicture" class="w-full h-full object-cover" />
                <Icon v-else name="lucide:circle-user-round" class="text-gray-400 text-9xl" />
                <input id="fileInput" type="file" accept="image/*" @change="onFileChange" class="hidden"
                    ref="fileInput" />
            </label>
            <Icon name="icon-park-twotone:add-one"
                class="absolute top-[80%] right-2 z-10 text-2xl opacity-50 group-hover:opacity-100 transition-all duration-200 ease-in-out" />
        </div>



        <!-- Recadrage de l'image -->
        <div v-if="image" class="cropper-container flex flex-col items-center">
            <Cropper ref="cropper" :src="image" :stencil-props="{ aspectRatio: 1 }" class="cropper" />
            <button @click="cropImage" class="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer">
                Valider
            </button>
        </div>
    </div>
</template>