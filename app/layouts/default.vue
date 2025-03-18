<script setup lang="ts">
const { loggedIn } = useUserSession();
</script>

<template>
  <div>
    <AppHeader v-if="loggedIn" class="fixed z-50" />
    <div>
      <main
        class="min-h-[calc(100vh-48px)] bg-neutral-950 pb-10 pt-24 text-white"
      >
        <slot></slot>
      </main>
    </div>

    <AppFooter />
  </div>
</template>
