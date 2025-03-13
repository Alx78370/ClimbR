<script setup lang="ts">
defineProps<{
    activeTab: 'profil' | 'requests' | 'friends';
}>();
defineEmits(['update:activeTab']);
</script>

<template>
    <div class="flex items-center gap-6">
        <button class="font-bold mb-6 pr-6 border-r-2 cursor-pointer"
            :class="{ 'text-orange-500 border-white': activeTab === 'profil' }"
            @click="$emit('update:activeTab', 'profil')">
            Mon profil
        </button>
        <button class="font-bold mb-6 pr-6 border-r-2 cursor-pointer"
            :class="{ 'text-orange-500 border-white': activeTab === 'requests' }"
            @click="$emit('update:activeTab', 'requests')">
            Demandes d'amis
        </button>
        <button class="font-bold mb-6 cursor-pointer" :class="{ 'text-orange-500': activeTab === 'friends' }"
            @click="$emit('update:activeTab', 'friends')">
            Ma liste d'amis
        </button>
    </div>
</template>