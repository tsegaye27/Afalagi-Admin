<script setup>
import { useAdminStore } from "~/stores/store";
const store = useAdminStore();
const { $axios } = useNuxtApp();
const countUsers = ref(0);
const countPosts = ref(0);

onMounted(async () => {
  if (!store.token) {
    navigateTo("/auth/login");
  } else {
    try {
      // Fetch total users
      const userRes = await $axios.get("/user", {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
      countUsers.value = userRes.data.totalRecords;

      // Fetch total posts
      const postRes = await $axios.get("/post/advanced", {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
      countPosts.value = postRes.data.totalRecords;
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    }
  }
});
</script>

<template>
  <div class="flex flex-col pt-8 gap-8 w-full">
    <section>
      <p class="font-medium text-2xl">
        Hello, Tsegaye👋
        <span class="font-regular text-lg text-[#868686]"
          >- here is what was happening in Afalagi today</span
        >
      </p>
    </section>
    <section class="flex gap-8">
      <StatCard title="New Users" :value="0" />
      <StatCard title="Total Users" :value="countUsers" />
      <StatCard title="New Posts" :value="0" />
      <StatCard title="Total Posts" :value="countPosts" />
    </section>
  </div>
</template>
