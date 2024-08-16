<script setup>
import { useAdminStore } from "~/stores/store";
const store = useAdminStore();

onMounted(() => {
  if (!store.token) {
    navigateTo("/auth/login");
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
      <StatCard title="New Users" value="0" />
      <StatCard title="Total Users" value="0" />
      <StatCard title="New Posts" value="0" />
      <StatCard title="Total Posts" value="0" />
    </section>
  </div>
</template>
