<script setup>
import { useAdminStore } from "~/stores/store";

const store = useAdminStore();
onMounted(() => {
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
    class="sidebar w-[15rem] h-[42rem] border-r border-[var(--secondary-color)]"
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
        <nuxt-link to="/analytics" class="sidebar-link">
          <li
            class="cursor-pointer flex gap-2 items-center hover:bg-gray-200 rounded-lg p-2 transition-all"
          >
            <span class="flex text-[var(--secondary-color)]">
              <Icon name="iconoir:reports" size="19px" />
            </span>
            <span class="flex text-[var(--primary-color)]">Analytics</span>
          </li>
        </nuxt-link>
        <nuxt-link to="/activity" class="sidebar-link">
          <li
            class="cursor-pointer flex gap-2 items-center hover:bg-gray-200 rounded-lg p-2 transition-all"
          >
            <span class="flex text-[var(--secondary-color)]">
              <Icon name="ph:activity-light" size="19px" />
            </span>
            <span class="flex text-[var(--primary-color)]">Activity</span>
          </li>
        </nuxt-link>
      </div>
      <div class="flex flex-col gap-4">
        <nuxt-link to="/profile" class="sidebar-link">
          <li
            class="cursor-pointer flex gap-2 items-center hover:bg-gray-200 rounded-lg p-2 transition-all"
          >
            <span class="flex text-[var(--secondary-color)]">
              <Icon
                name="material-symbols:person-edit-outline-sharp"
                size="19px"
              />
            </span>
            <span class="flex text-[var(--primary-color)]">Profile</span>
          </li>
        </nuxt-link>
        <nuxt-link to="/settings" class="sidebar-link">
          <li
            class="cursor-pointer flex gap-2 items-center hover:bg-gray-200 rounded-lg p-2 transition-all"
          >
            <span class="flex text-[var(--secondary-color)]">
              <Icon name="material-symbols:settings-outline" size="19px" />
            </span>
            <span class="flex text-[var(--primary-color)]">Settings</span>
          </li>
        </nuxt-link>
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
