<script setup lang="ts">
import { useTimeAgo } from "@vueuse/core";

const props = defineProps<{
    comments: {
        id: number;
        content: string;
        created_at: string;
        first_name: string;
        last_name: string;
        profile_picture?: string;
    }[];
}>();

// ✅ Générer un `timeAgo` réactif pour chaque commentaire
const formattedComments = computed(() =>
    props.comments
        .slice()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 2)
);


// ✅ Fonction pour capitaliser les noms
const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
</script>

<template>
    <div v-if="formattedComments.length > 0" class="mt-4 space-y-3">
        <div v-for="comment in formattedComments" :key="comment.id" class="flex items-start gap-3">
            <img v-if="comment.profile_picture" :src="comment.profile_picture" alt="profile"
                class="w-8 h-8 rounded-full border border-neutral-900">
            <Icon v-else name="lucide:circle-user-round" class="w-8 h-8 text-white" />

            <div class="flex-1">
                <div class="flex justify-between">
                    <p class="text-sm font-semibold">
                        {{ capitalize(comment.first_name) }} {{ capitalize(comment.last_name) }}
                    </p>
                    <p class="text-xs text-gray-400">
                        {{ useTimeAgo(new Date(comment.created_at), { updateInterval: 60000 }) }}
                    </p>

                </div>
                <p class="mt-1 text-sm">{{ comment.content }}</p>
            </div>
        </div>
    </div>
</template>
