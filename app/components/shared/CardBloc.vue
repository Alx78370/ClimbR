<script setup lang="ts">

const props = defineProps<{
    bloc: {
        id: number;
        titre: string;
        description?: string;
        couleur: string;
        type: string;
        essai: string;
        salle_name: string;
        date_validation: string;
        media?: string;
        first_name: string;
        last_name: string;
        profile_picture?: string;
    };
    editable?: boolean;
}>();


const emit = defineEmits<{
    (event: "delete", id: number): void;
}>();

const isCommenting = ref(false);
const { comments } = useComment(props.bloc.id);
const { likes } = useLike(props.bloc.id);
const commentCount = computed(() => comments.value.length);
const likeCount = computed(() => likes.value);

const handleCommentSubmit = (comment: string) => {
    console.log("Commentaire envoyé :", comment);
    isCommenting.value = false;
};

const colorClasses: { [key: string]: string } = {
    jaune: "bg-yellow-500",
    orange: "bg-orange-500",
    vert: "bg-green-500",
    bleu: "bg-blue-500",
    rose: "bg-pink-500",
    rouge: "bg-red-500",
    noir: "bg-black",
    violet: "bg-purple-500",
};

const blocTypeMap: Record<string, string> = {
    dalle: "Dalle",
    vertical: "Vertical",
    leger_devers: "Léger dévers",
    gros_devers: "Gros dévers",
    toit: "Toit",
    diedre: "Dièdre",
    arete: "Arête",
};

const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
</script>

<template>
    <article class="flex flex-col bg-neutral-900 text-white w-full rounded p-5 gap-5">
        <div class="flex flex-col gap-5 w-full">
            <div class="flex flex-col">
                <div class="flex justify-between items-start w-full">
                    <div class="flex items-start gap-3 h-12 mb-5">
                        <img v-if="bloc.profile_picture" :src="`${bloc.profile_picture}`" alt="profile picture"
                            class="w-12 h-12 rounded-full object-cover">
                        <Icon v-else name="lucide:circle-user-round" class="text-5xl" />
                        <div>
                            <p class="font-semibold">
                                {{ capitalize(bloc.first_name) + ' ' + capitalize(bloc.last_name) }}
                            </p>
                            <p class="text-sm text-gray-300 mb-5">
                                Validé le {{ bloc.date_validation }} - {{ bloc.salle_name }}
                            </p>
                        </div>
                    </div>
                    <div v-if="editable" class="flex gap-5">
                        <NuxtLink :to="`/blocs/${bloc.id}`">
                            <Icon name="fa6-solid:pen-to-square"
                                class="text-white text-2xl hover:scale-110 transition-all cursor-pointer" />
                        </NuxtLink>
                        <button @click="emit('delete', bloc.id)">
                            <Icon name="ion:trash"
                                class="text-white text-2xl hover:scale-110 transition-all cursor-pointer" />
                        </button>
                    </div>
                </div>
                <p class="font-bold">{{ bloc.titre }}</p>
                <p class="mb-5">{{ bloc.description }}</p>

                <div class="flex gap-10">
                    <div class="flex flex-col items-start gap-2">
                        <p class="text-sm text-gray-300">Difficulté</p>
                        <div class="w-4 h-4 rounded-full border-2 border-white" :class="colorClasses[bloc.couleur]">
                        </div>
                    </div>
                    <div>
                        <p class="text-sm text-gray-300">Type de bloc</p>
                        <p>{{ blocTypeMap[bloc.type] }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-300">Nb d'essais</p>
                        <div v-if="bloc.essai === 'Flash'" class="flex items-center gap-2">
                            <p>{{ bloc.essai }}</p>
                            <Icon name="typcn:flash" class="text-yellow-500" />
                        </div>
                        <p v-else>{{ bloc.essai }}</p>
                    </div>
                </div>
            </div>
        </div>
        <img :src="`${bloc.media}`" :alt="`bloc ${bloc.couleur} à ${bloc.salle_name}`"
            class="w-full h-[500px] rounded object-cover" />
        <div class="flex justify-between items-center">
            <div class="flex items-start gap-3">
                <LikeButton :bloc-id="bloc.id" />
                <CommentButton :isCommenting="isCommenting" @toggle-comment="isCommenting = !isCommenting" />
            </div>
            <div class="flex items-center gap-2">
                <LikeDisplay :bloc-id="bloc.id" />
                <span v-if="commentCount > 0 && likeCount > 0" class="text-xl font-bold opacity-70">·</span>
                <CommentDisplay :comment-count="commentCount" />
            </div>

        </div>
        <CommentSection :comments="comments" />
        <Transition name="fade">
            <CommentInput v-if="isCommenting" :bloc-id="bloc.id" @submit="handleCommentSubmit"
                @cancel="isCommenting = false" />
        </Transition>
    </article>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>