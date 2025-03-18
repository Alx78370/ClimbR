<template>
  <div class="-mt-20 flex h-[90vh]">
    <img src="/images/cover1.webp" class="h-full w-[40%] object-cover" />
    <div
      class="flex h-full w-[20%] flex-col items-center justify-center bg-neutral-950 px-5"
    >
      <h1 class="text-center text-3xl text-white">
        Commencer à suivre votre progression en ajoutant votre dernier bloc
        validé !
      </h1>
      <NuxtLink
        to="/blocs/new"
        class="mt-5 cursor-pointer rounded-md bg-orange-500 px-5 py-2 text-white transition-all duration-200 ease-in-out hover:scale-105"
      >
        Ajouter un bloc
      </NuxtLink>
    </div>
    <img src="/images/cover2.webp" class="h-full w-[40%] object-cover" />
  </div>
</template>
