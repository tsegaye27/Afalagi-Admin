<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Success Stories</h1>

    <!-- Search and Filter -->
    <div class="flex justify-between items-center mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search success stories..."
        class="border outline-none rounded p-2 w-1/3"
      />

      <select
        v-model="filterStatus"
        class="border outline-none rounded p-2 w-1/4"
      >
        <option value="">All Statuses</option>
        <option value="UNDER_REVIEW">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>
    </div>

    <!-- Success Stories Table -->
    <div class="overflow-auto">
      <table class="min-w-full bg-white border">
        <thead>
          <tr class="w-full bg-gray-200">
            <th class="text-left p-4 border-b">Reporter</th>
            <th class="text-left p-4 border-b">Title</th>
            <th class="text-left p-4 border-b">Date</th>
            <th class="text-left p-4 border-b">Status</th>
            <th class="text-left p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="story in filteredStories"
            :key="story.id"
            class="hover:bg-gray-100"
          >
            <td class="p-4 border-b">
              {{
                `${story.user.Profile?.firstName} ${story.user.Profile?.lastName}`
              }}
            </td>
            <td class="p-4 border-b whitespace-nowrap">
              {{ story.title }}
            </td>
            <td class="p-4 border-b whitespace-nowrap">
              {{ formatDate(story.dateSubmitted) }}
            </td>
            <td
              :class="{
                'text-yellow-500': story.status === 'UNDER_REVIEW',
                'text-green-500': story.status === 'APPROVED',
                'text-red-500': story.status === 'REJECTED',
              }"
              class="p-4 border-b"
            >
              {{ setStatus(story.status) }}
            </td>
            <td class="p-4 border-b flex">
              <button
                title="View Story"
                @click="viewDetails(story.id)"
                class="text-blue-500 flex items-center p-2 hover:text-blue-600 rounded-full"
              >
                <Icon name="mage:preview" size="20px" />
              </button>
              <button
                title="Approve Story"
                v-if="story.status === 'UNDER_REVIEW'"
                @click="approveStory(story.id)"
                class="text-green-500 ml-4 flex justify-center p-2 items-center hover:text-green-600 rounded-full"
              >
                <Icon name="material-symbols:check-rounded" size="20px" />
              </button>
              <button
                title="Reject Story"
                v-if="story.status === 'UNDER_REVIEW'"
                @click="rejectStory(story.id)"
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
const successStories = ref([]);

const fetchSuccessStories = async () => {
  try {
    const res = await $axios.get("/success-story/advanced", {
      headers: {
        Authorization: `Bearer ${store.token}`,
      },
    });
    successStories.value = res.data.data;
  } catch (err) {
    if (err.response?.status === 404) {
      console.error("API endpoint not found.");
    } else {
      console.error(err.response ? err.response.data : err.message);
    }
  }
};

onMounted(fetchSuccessStories);

const approveStory = async (id) => {
  try {
    const res = await $axios.post(`/success-stories/status/${id}`, null, {
      params: { status: "APPROVED" },
      headers: {
        Authorization: `Bearer ${store.token}`,
      },
    });
    console.log("success", res);
    fetchSuccessStories();
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
  }
};

const rejectStory = async (id) => {
  try {
    const res = await $axios.post(`/success-stories/status/${id}`, null, {
      params: { status: "REJECTED" },
      headers: {
        Authorization: `Bearer ${store.token}`,
      },
    });
    console.log("success", res);
    fetchSuccessStories();
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
  }
};

const setStatus = (status) => {
  if (status === "APPROVED") return "Approved";
  if (status === "UNDER_REVIEW") return "Pending";
  if (status === "REJECTED") return "Rejected";
};

// Search and Filter States
const searchQuery = ref("");
const filterStatus = ref("");

const filteredStories = computed(() => {
  return successStories.value.filter((story) => {
    const matchesSearch =
      story.user.Profile.firstName
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      story.user.Profile.middleName
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      story.user.Profile.lastName
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      story.title.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesStatus =
      filterStatus.value === "" || story.status === filterStatus.value;

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
