<script setup lang="ts">
defineProps<{
  bloc: {
    couleur: string;
    type: string;
    essai: string;
  };
}>();

const colorClasses: Record<string, string> = {
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
</script>

<template>
  <div class="flex gap-10">
    <div class="flex flex-col items-start gap-2">
      <p class="text-sm text-gray-300">Difficulté</p>
      <div
        class="h-4 w-4 rounded-full border-2 border-white"
        :class="colorClasses[bloc.couleur]"
      ></div>
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
</template>
