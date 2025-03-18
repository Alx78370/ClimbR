<script setup lang="ts">
defineProps<{
  activeTab: "profil" | "requests" | "friends";
}>();
defineEmits(["update:activeTab"]);
</script>

<template>
  <div class="flex items-center gap-6">
    <button
      class="mb-6 cursor-pointer border-r-2 pr-6 font-bold"
      :class="{ 'border-white text-orange-500': activeTab === 'profil' }"
      @click="$emit('update:activeTab', 'profil')"
    >
      Mon profil
    </button>
    <button
      class="mb-6 cursor-pointer border-r-2 pr-6 font-bold"
      :class="{ 'border-white text-orange-500': activeTab === 'requests' }"
      @click="$emit('update:activeTab', 'requests')"
    >
      Demandes d'amis
    </button>
    <button
      class="mb-6 cursor-pointer font-bold"
      :class="{ 'text-orange-500': activeTab === 'friends' }"
      @click="$emit('update:activeTab', 'friends')"
    >
      Ma liste d'amis
    </button>
  </div>
</template>
