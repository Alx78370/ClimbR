<script setup lang="ts">
const props = defineProps<{
  bloc: {
    id: number;
    user_id: number;
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

const { comments, deleteComment } = useComment(props.bloc.id);
const { likes } = useLike(props.bloc.id);

const commentCount = computed(() => comments.value.length);
const likeCount = computed(() => likes.value);

const handleCommentSubmit = (comment: string) => {
  console.log("Commentaire envoyé :", comment);
  isCommenting.value = false;
};
</script>

<template>
  <article
    class="flex w-full flex-col gap-5 rounded bg-neutral-900 p-5 text-white"
  >
    <div class="flex w-full flex-col gap-5">
      <div class="flex flex-col">
        <CardBlocHeader
          :bloc="{
            id: bloc.id,
            first_name: bloc.first_name,
            last_name: bloc.last_name,
            date_validation: bloc.date_validation,
            salle_name: bloc.salle_name,
            profile_picture: bloc.profile_picture,
          }"
          :editable="editable"
          @delete="emit('delete', $event)"
        />

        <p class="font-bold">{{ bloc.titre }}</p>
        <p class="mb-5">{{ bloc.description }}</p>

        <CardBlocMeta
          :bloc="{
            couleur: bloc.couleur,
            type: bloc.type,
            essai: bloc.essai,
          }"
        />
      </div>
    </div>

    <CardBlocImage
      :media="bloc.media"
      :alt-text="`bloc ${bloc.couleur} à ${bloc.salle_name}`"
    />

    <CardBlocFooter
      :bloc-id="bloc.id"
      :bloc-title="bloc.titre"
      :bloc-owner-id="bloc.user_id"
      :comment-count="commentCount"
      :like-count="likeCount"
      :is-commenting="isCommenting"
      @toggle-comment="isCommenting = !isCommenting"
    />

    <CommentSection
      :comments="comments"
      :bloc-owner-id="bloc.user_id"
      :delete-comment="deleteComment"
    />

    <CommentDisplay
      :bloc-id="bloc.id"
      :bloc-title="bloc.titre"
      :bloc-owner-id="bloc.user_id"
      :comment-count="commentCount"
      :min-comments="3"
    >
      Voir les {{ commentCount }} commentaires
    </CommentDisplay>

    <Transition name="fade">
      <CommentInput
        v-if="isCommenting"
        :bloc-id="bloc.id"
        :auto-close="true"
        @submit="handleCommentSubmit"
        @cancel="isCommenting = false"
      />
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
