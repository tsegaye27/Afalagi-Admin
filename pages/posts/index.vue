<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Posts</h1>

    <!-- Search and Filter -->
    <div class="flex justify-between items-center mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search posts..."
        class="border outline-none rounded p-2 w-1/3"
      />

      <select
        v-model="filterStatus"
        class="border outline-none rounded p-2 w-1/4"
      >
        <option selected value="">All</option>
        <option value="UNDER_REVIEW">Pending</option>
        <option value="OPEN">Approved</option>
        <option value="REJECTED">Rejected</option>
        <option value="CLOSED">Closed</option>
      </select>
    </div>
    <div v-if="filteredPosts.length === 0" class="text-center">
      <p class="text-[var(--primary-color)] my-8 font-medium">No posts found</p>
    </div>
    <!-- Posts Table -->
    <div v-else class="overflow-auto">
      <table class="min-w-full bg-white border">
        <thead>
          <tr class="w-full bg-gray-200">
            <th class="text-left p-4 border-b">ID</th>
            <th class="text-left p-4 border-b">Reporter</th>
            <th class="text-left p-4 border-b whitespace-nowrap">
              Missing Person
            </th>
            <th class="text-left p-4 border-b">Submission Date</th>
            <th class="text-left p-4 border-b">Status</th>
            <th class="text-left p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(post, index) in filteredPosts"
            :key="post.id"
            class="hover:bg-gray-100"
          >
            <td class="p-4 border-b">
              {{ index + 1 }}
            </td>
            <td class="p-4 border-b">
              {{
                `${post.user.Profile?.firstName} ${post.user.Profile?.middleName} ${post.user.Profile?.lastName}`
              }}
            </td>
            <td class="p-4 border-b whitespace-nowrap">
              {{ `${post.firstName} ${post.middleName} ${post.lastName}` }}
            </td>
            <td class="p-4 border-b whitespace-nowrap">
              {{ formatDate(post.createdAt) }}
            </td>
            <td
              :class="{
                'text-yellow-500': post.status === 'UNDER_REVIEW',
                'text-green-500': post.status === 'OPEN',
                'text-red-500': post.status === 'REJECTED',
                'text-blue-500': post.status === 'CLOSED',
              }"
              class="p-4 border-b"
            >
              {{ setStatus(post.status) }}
            </td>
            <td class="p-4 border-b flex">
              <button
                title="View Post"
                @click="viewDetails(post.id)"
                class="text-blue-500 flex items-center p-2 hover:text-blue-600 rounded-full"
              >
                <Icon name="mage:preview" size="20px" />
              </button>
              <button
                title="Approve Post"
                v-if="post.status === 'UNDER_REVIEW'"
                @click="approvePost(post.id)"
                class="text-green-500 ml-4 flex justify-center p-2 items-center hover:text-green-600 rounded-full"
              >
                <Icon name="material-symbols:check-rounded" size="20px" />
              </button>
              <button
                title="Reject Post"
                v-if="post.status === 'UNDER_REVIEW'"
                @click="rejectPost(post.id)"
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

const viewDetails = (postId) => {
  navigateTo(`/posts/${postId}`);
};
const fetchPosts = async () => {
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
};
onMounted(fetchPosts);

const approvePost = async (id) => {
  console.log(id);
  try {
    const res = await $axios.post(`/post/status/${id}`, null, {
      params: { status: "OPEN" },
      headers: {
        Authorization: `Bearer ${store.token}`,
      },
    });
    console.log("success", res);
    // Update the post status locally
    const post = posts.value.find((p) => p.id === id);
    //if (post) {
    //post.status = "OPEN";
    //}
    fetchPosts();
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
  }
};

const rejectPost = async (id) => {
  try {
    const res = await $axios.post(`/post/status/${id}`, null, {
      params: { status: "REJECTED" },
      headers: {
        Authorization: `Bearer ${store.token}`,
      },
    });
    console.log("success", res);
    // Update the post status locally
    const post = posts.value.find((p) => p.id === id);
    if (post) {
      post.status = "REJECTED";
    }
    fetchPosts();
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
  }
};

const setStatus = (status) => {
  if (status === "OPEN") return "Approved";
  if (status === "UNDER_REVIEW") return "Pending";
  if (status === "REJECTED") return "Rejected";
  if (status === "CLOSED") return "Closed";
};

// Search and Filter States
const searchQuery = ref("");
const filterStatus = ref("");

const filteredPosts = computed(() => {
  return posts.value.filter((post) => {
    const matchesSearch =
      `${post.user.Profile?.firstName} ${post.user.Profile?.middleName} ${post.user.Profile?.lastName}`
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      `${post.firstName} ${post.middleName} ${post.lastName}`
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

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
  const time = dateObj.toLocaleTimeString();

  return `${time}, ${month} ${day}, ${year}`;
}
</script>
