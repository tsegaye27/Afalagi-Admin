<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Users(with Profile)</h1>

    <!-- Search and Filter -->
    <div class="flex justify-between items-center mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search posts..."
        class="border rounded outline-none p-2 w-1/3"
      />

      <select
        v-model="filterGender"
        class="border outline-none rounded p-2 w-1/4"
      >
        <option value="">All</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
      </select>
    </div>

    <!-- Posts Table -->
    <div class="overflow-auto">
      <table class="min-w-full bg-white border">
        <thead>
          <tr class="w-full bg-gray-200">
            <th class="text-left p-4 border-b whitespace-nowrap">First Name</th>
            <th class="text-left p-4 border-b whitespace-nowrap">
              Middle Name
            </th>
            <th class="text-left p-4 border-b whitespace-nowrap">Last Name</th>
            <th class="text-left p-4 border-b">Gender</th>
            <th class="text-left p-4 border-b">Country</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="hover:bg-gray-100"
          >
            <td class="p-4 border-b">
              {{ `${user.firstName}` }}
            </td>
            <td class="p-4 border-b whitespace-nowrap">
              {{ `${user.middleName}` }}
            </td>
            <td class="p-4 border-b whitespace-nowrap">
              {{ `${user.lastName}` }}
            </td>
            <td class="p-4 border-b whitespace-nowrap">
              {{ `${user.gender}` }}
            </td>
            <td class="p-4 border-b whitespace-nowrap">
              {{ `${user.country}` }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useAdminStore } from "~/stores/store";

const store = useAdminStore();
const { $axios } = useNuxtApp();
const users = ref([]);

onMounted(async () => {
  try {
    const res = await $axios.get("/user/profiles/all", {
      headers: {
        Authorization: `Bearer ${store.token}`,
      },
    });
    users.value = res.data.data;
    console.log("success", res.data);
  } catch (err) {
    console.log(err.res ? err.res.data : err.message);
  }
});

// Search and Filter States
const searchQuery = ref("");
const filterGender = ref("");

// Computed property for filtered users
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.middleName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesGender =
      filterGender.value === "" || user.gender === filterGender.value;

    return matchesSearch && matchesGender;
  });
});

function formatDate(dateStr) {
  const dateObj = new Date(dateStr);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = monthNames[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${month} ${day}, ${year}`;
}
</script>
