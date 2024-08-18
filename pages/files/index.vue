<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Files</h1>

    <!-- Search and Filter -->
    <div class="flex justify-between items-center mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search files..."
        class="border rounded outline-none p-2 w-1/3"
      />

      <select
        v-model="filterStatus"
        class="border outline-none rounded p-2 w-1/4"
      >
        <option value="">All Statuses</option>
        <option value="UNDER_REVIEW">Pending</option>
        <option value="OPEN">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>
    </div>

    <!-- Posts Table -->
    <div class="overflow-auto">
      <table class="bg-white border table-auto">
        <thead>
          <tr class="w-full bg-gray-200">
            <th class="text-left p-4 border-b">Reporter</th>
            <th class="text-left p-4 border-b whitespace-nowrap">
              Missing Person
            </th>
            <th class="text-left p-4 border-b">Date</th>
            <th class="text-left p-4 border-b">Status</th>
            <th class="text-left p-4 border-b">Images</th>
            <th class="text-left p-4 border-b whitespace-nowrap">
              Legal Document
            </th>
            <th class="text-left p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="post in filteredPosts"
            :key="post.id"
            class="hover:bg-gray-100"
          >
            <td class="p-4 border-b whitespace-nowrap">
              {{
                `${post.user.Profile?.firstName} ${post.user.Profile?.middleName} ${post.user.Profile?.lastName}`
              }}
            </td>
            <td class="p-4 border-b whitespace-nowrap">
              {{ `${post.firstName} ${post.middleName} ${post.lastName}` }}
            </td>
            <td class="p-4 border-b whitespace-nowrap">
              {{ formatDate(post.lastSeenDate) }}
            </td>
            <td
              :class="{
                'text-yellow-500': post.status === 'UNDER_REVIEW',
                'text-green-500': post.status === 'OPEN',
                'text-red-500': post.status === 'REJECTED',
              }"
              class="p-4 border-b"
            >
              {{ setStatus(post.status) }}
            </td>
            <td class="p-4 border-b whitespace-nowrap">{{ post.images }}</td>
            <td class="p-4 border-b whitespace-nowrap">
              {{ post.legalDocuments }}
            </td>
            <td class="p-4 border-b flex">
              <button
                class="text-blue-500 flex items-center p-2 hover:text-blue-600 rounded-full"
              >
                <Icon name="mage:preview" size="20px" />
              </button>
              <button
                v-if="post.status === 'UNDER_REVIEW'"
                class="text-green-500 ml-4 flex justify-center p-2 items-center hover:text-green-600 rounded-full"
              >
                <Icon name="material-symbols:check-rounded" size="20px" />
              </button>
              <button
                v-if="post.status === 'UNDER_REVIEW'"
                class="text-red-500 ml-4 flex justify-center p-2 items-center hover:text-red-600 rounded-full"
              >
                <Icon
                  name="material-symbols:delete-outline-rounded"
                  size="20px"
                />
              </button>
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
const posts = ref([]);

onMounted(async () => {
  try {
    const res = await $axios.get("/post/advanced", {
      headers: {
        Authorization: `Bearer ${store.token}`,
      },
    });
    posts.value = res.data.data;
    console.log("success", res.data);
  } catch (err) {
    console.log(err.res ? err.res.data : err.message);
  }
});

const setStatus = (status) => {
  if (status === "OPEN") return "Approved";
  if (status === "UNDER_REVIEW") return "Pending";
  if (status === "REJECTED") return "Rejected";
};

// Search and Filter States
const searchQuery = ref("");
const filterStatus = ref("");

const filteredPosts = computed(() => {
  return posts.value.filter((post) => {
    const matchesSearch =
      post.user.Profile?.firstName
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      post.user.Profile?.middleName
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      post.user.Profile?.lastName
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      post.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.middleName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.lastName.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesStatus =
      filterStatus.value === "" || post.status === filterStatus.value;

    return matchesSearch && matchesStatus;
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
