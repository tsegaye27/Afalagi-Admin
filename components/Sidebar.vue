<script setup>
import { useAdminStore } from "~/stores/store";

const store = useAdminStore();
const accessTokenCookie = useCookie("access_token");
const refreshTokenCookie = useCookie("refresh_token");

const setCookiesToStore = () => {
  if (accessTokenCookie.value && refreshTokenCookie.value) {
    store.setToken(accessTokenCookie.value);
    store.setRefreshToken(refreshTokenCookie.value);
  }
};

watchEffect(() => {
  setCookiesToStore();
});

onMounted(() => {
  setCookiesToStore();
  if (!store.token) navigateTo("/auth/login");
});

const logout = () => {
  store.setToken();
  store.setRefreshToken();
  navigateTo("/auth/login");
};
</script>
<template>
  <div
    class="sidebar w-[15rem] h-[100vh] border-r border-[var(--secondary-color)]"
  >
    <ul class="flex flex-col items-start p-8 h-full justify-between gap-5">
      <div class="flex flex-col gap-4">
        <nuxt-link to="/" class="sidebar-link">
          <li
            class="cursor-pointer flex gap-2 items-center hover:bg-gray-200 rounded-lg p-2 transition-all"
          >
            <span class="flex text-[var(--secondary-color)]">
              <Icon name="ph:house" size="18px" />
            </span>
            <span class="flex text-[var(--primary-color)]">Dashboard</span>
          </li>
        </nuxt-link>
        <nuxt-link to="/users" class="sidebar-link">
          <li
            class="cursor-pointer flex gap-2 items-center hover:bg-gray-200 rounded-lg p-2 transition-all"
          >
            <span class="flex text-[var(--secondary-color)]">
              <Icon name="prime:users" size="19px" />
            </span>
            <span class="flex text-[var(--primary-color)]">Users</span>
          </li>
        </nuxt-link>
        <nuxt-link to="/posts" class="sidebar-link">
          <li
            class="cursor-pointer flex gap-2 items-center hover:bg-gray-200 rounded-lg p-2 transition-all"
          >
            <span class="flex text-[var(--secondary-color)]">
              <Icon name="ph:files" size="19px" />
            </span>
            <span class="flex text-[var(--primary-color)]">Posts</span>
          </li>
        </nuxt-link>
        <nuxt-link to="/files" class="sidebar-link">
          <li
            class="cursor-pointer flex gap-2 items-center hover:bg-gray-200 rounded-lg p-2 transition-all"
          >
            <span class="flex text-[var(--secondary-color)]">
              <Icon
                name="material-symbols-light:folder-copy-outline"
                size="19px"
              />
            </span>
            <span class="flex text-[var(--primary-color)]">Files</span>
          </li>
        </nuxt-link>
        <nuxt-link to="/success-story" class="sidebar-link">
          <li
            class="cursor-pointer flex gap-2 items-center hover:bg-gray-200 rounded-lg p-2 transition-all"
          >
            <span class="flex text-[var(--secondary-color)]">
              <Icon
                name="material-symbols-light:folder-copy-outline"
                size="19px"
              />
            </span>
            <span class="flex text-[var(--primary-color)]">Story</span>
          </li>
        </nuxt-link>
      </div>
      <div class="flex flex-col gap-4">
        <li
          @click="logout"
          class="cursor-pointer flex gap-2 items-center hover:bg-[#e5e7eb] rounded-lg p-2 transition-all"
        >
          <span class="flex text-[var(--secondary-color)]">
            <Icon name="material-symbols:logout-sharp" size="19px" />
          </span>
          <span class="flex text-[var(--primary-color)]">Logout</span>
        </li>
      </div>
    </ul>
  </div>
</template>

<style scoped>
.sidebar-link {
  transition: background-color 0.3s ease;
}

.router-link-active {
  transition: background-color 0.3s ease;
  background-color: #e5e7eb;
  border-radius: 0.5rem;
}
.router-link-exact-active {
  transition: background-color 0.3s ease;
  background-color: #e5e7eb;
  border-radius: 0.5rem;
}
</style>
