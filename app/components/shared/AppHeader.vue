<script setup lang="ts">
const { loggedIn, clear, fetch, user } = useUserSession();
const { sendFriendRequest, message } = useFriends();

const showDropdown = ref(false);
const showAddFriendInput = ref(false);
const friendUsername = ref("");
const copySuccess = ref(false);

const logout = async () => {
  await clear();
  await fetch();
  navigateTo("/login");
};

const sendFriendRequestWithFeedback = async () => {
  if (!friendUsername.value || !user.value?.id) return;

  await sendFriendRequest(user.value.id, friendUsername.value);

  setTimeout(() => {
    message.value = "";
    friendUsername.value = "";
    showAddFriendInput.value = false;
  }, 3000);
};

const copyToClipboard = async () => {
  try {
    if (user.value?.username) {
      await navigator.clipboard.writeText(user.value.username);
      copySuccess.value = true;
      setTimeout(() => (copySuccess.value = false), 2000);
    }
  } catch (err) {
    console.error("Erreur lors de la copie :", err);
  }
};
</script>

<template>
  <header
    class="w-full border-b-2 border-neutral-900 bg-neutral-950 text-center"
  >
    <div class="mx-auto flex w-[60%] justify-between">
      <nav class="flex items-center gap-5 text-white">
        <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
        <NuxtLink to="/users/blocs" class="hover:underline">Mes blocs</NuxtLink>
      </nav>
      <div class="flex items-center gap-5">
        <div
          class="group relative flex flex-col gap-2 text-white"
          @mouseenter="showDropdown = true"
          @mouseleave="showDropdown = false"
        >
          <button v-if="loggedIn">
            <div
              v-if="!user?.profile_picture"
              class="flex items-center justify-center rounded-t border-x-2 border-t-2 border-transparent py-4 underline-offset-4 group-hover:border-x-2 group-hover:border-t-2 group-hover:border-neutral-900 group-hover:pl-2 hover:cursor-pointer hover:underline"
            >
              <Icon name="lucide:circle-user-round" class="text-4xl" />
              <Icon name="lucide:chevron-down" class="text-2xl" />
            </div>
            <div
              v-else
              class="flex items-center justify-center rounded-t border-x-2 border-t-2 border-transparent py-4 underline-offset-4 group-hover:border-x-2 group-hover:border-t-2 group-hover:border-neutral-900 group-hover:pl-2 hover:cursor-pointer hover:underline"
            >
              <img
                :src="user?.profile_picture"
                alt="profile picture"
                class="h-10 w-10 rounded-full"
              />
              <Icon name="lucide:chevron-down" class="text-2xl" />
            </div>
          </button>
          <div
            v-if="loggedIn && showDropdown"
            class="absolute -bottom-[1.5px] left-0 z-10 mx-auto h-[1.5px] w-full border-x-2 border-neutral-900 bg-neutral-950"
          ></div>
          <div
            v-if="loggedIn && showDropdown"
            class="absolute top-full right-0 flex w-fit flex-col rounded-b border-2 border-neutral-900 bg-neutral-950 px-2"
          >
            <div class="flex items-center justify-center hover:bg-neutral-900">
              <p
                class="cursor-pointer p-2 font-bold select-text"
                @click="copyToClipboard"
              >
                {{ user?.username }}
              </p>
              <button
                class="flex cursor-pointer items-end justify-center"
                @click="copyToClipboard"
              >
                <Icon
                  v-if="copySuccess"
                  name="lucide:copy-check"
                  class="h-5 w-5"
                />
                <Icon v-else name="lucide:copy" class="h-5 w-5" />
              </button>
            </div>
            <button
              class="cursor-pointer p-2 text-nowrap hover:bg-neutral-900"
              @click="showAddFriendInput = !showAddFriendInput"
            >
              Ajouter un ami
            </button>

            <div v-if="showAddFriendInput" class="flex flex-col">
              <input
                v-model="friendUsername"
                type="text"
                placeholder="Pseudo#1234"
                class="rounded border bg-neutral-900 p-2 text-center text-white"
              />
              <button
                class="mt-2 cursor-pointer rounded bg-orange-500 p-2 text-white"
                @click="sendFriendRequestWithFeedback"
              >
                Envoyer
              </button>
              <p v-if="message" class="text-orange-500">{{ message }}</p>
            </div>

            <NuxtLink
              to="/profile"
              class="cursor-pointer p-2 text-nowrap hover:bg-neutral-900"
            >
              Mon profil
            </NuxtLink>
            <button
              class="cursor-pointer rounded-b p-2 text-orange-500 hover:bg-orange-500 hover:text-white"
              @click="logout"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <NuxtLink
          to="/blocs/new"
          class="group relative flex w-fit items-center justify-center"
        >
          <Icon
            name="icon-park-outline:add-one"
            class="absolute text-4xl text-orange-500 opacity-100 transition-opacity duration-200 group-hover:opacity-0"
          />
          <Icon
            name="icon-park-solid:add-one"
            class="text-4xl text-orange-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.border-gradient {
  border-width: 2px;
  border-style: solid;
  border-image: linear-gradient(to right, #f97316, #ef4444, #ec4899) 1;
}
</style>
