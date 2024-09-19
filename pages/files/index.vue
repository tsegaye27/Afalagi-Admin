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
        <option selected value="">All</option>
        <option value="UNDER_REVIEW">Pending</option>
        <option value="OPEN">Approved</option>
        <option value="REJECTED">Rejected</option>
        <option value="CLOSED">Closed</option>
      </select>
    </div>

    <div v-if="filteredPosts.length === 0" class="text-center">
      <p class="text-[var(--primary-color)] my-8 font-medium">No files found</p>
    </div>

    <!-- Posts Table -->
    <div v-else class="overflow-auto">
      <table class="bg-white border w-full table-auto">
        <thead>
          <tr class="w-full bg-gray-200">
            <th class="text-left p-4 border-b">ID</th>
            <th class="text-left p-4 border-b">Reporter</th>
            <th class="text-left p-4 border-b whitespace-nowrap">
              Missing Person
            </th>
            <th class="text-left p-4 border-b">Submission Date</th>
            <th class="text-left p-4 border-b">Status</th>
            <th class="text-left p-4 border-b">Image</th>
            <th class="text-left p-4 border-b whitespace-nowrap">Document</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(post, index) in filteredPosts"
            :key="post.id"
            class="hover:bg-gray-100"
          >
            <td class="p-4 border-b whitespace-nowrap">{{ index + 1 }}</td>
            <td class="p-4 border-b whitespace-nowrap">
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
            <td :class="getStatusClass(post.status)" class="p-4 border-b">
              {{ setStatus(post.status) }}
            </td>
            <td class="p-4 border-b whitespace-nowrap">
              <button
                class="text-blue-500 flex items-center p-2 hover:text-blue-600 rounded-full"
                title="View Image"
                @click="viewImage(post.images)"
              >
                <Icon name="mage:preview" size="20px" />
              </button>
            </td>
            <td class="p-4 border-b whitespace-nowrap">
              <button
                class="text-blue-500 flex items-center p-2 hover:text-blue-600 rounded-full"
                title="View Document"
                @click="viewDocument(post.legalDocuments)"
              >
                <Icon name="mage:preview" size="20px" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->

    <transition name="modal">
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="close-button" @click="closeModal">x</button>
          <!-- Image Modal -->
          <div v-if="isImage" class="relative group">
            <a
              :href="`http://localhost:3333/uploads/post/${currentFile}`"
              download
            >
              <img
                :src="`http://localhost:3333/uploads/post/${currentFile}`"
                class="modal-image"
              />
            </a>
            <div
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <a
                :href="`http://localhost:3333/uploads/post/${currentFile}`"
                download
                class="bg-blue-500 text-white py-2 px-4 rounded"
                target="_blank"
              >
                Download Image
              </a>
            </div>
          </div>
          <!-- Document Modal -->
          <div v-else class="relative group">
            <iframe
              :src="`http://localhost:3333/uploads/post/${currentFile}`"
              class="modal-document"
              frameborder="0"
            ></iframe>
            <div
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <a
                :href="`http://localhost:3333/uploads/post/${currentFile}`"
                download
                target="_blank"
                class="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Download Document
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAdminStore } from "~/stores/store";

const store = useAdminStore();
const { $axios } = useNuxtApp();
const posts = ref([]);
const isModalOpen = ref(false);
const currentFile = ref("");
const isImage = ref(false);

onMounted(async () => {
  try {
    const res = await $axios.get("/post/advanced", {
      headers: {
        Authorization: `Bearer ${store.token}`,
      },
    });
    posts.value = res.data.data;
  } catch (err) {
    console.log(err.res ? err.res.data : err.message);
  }
});

const setStatus = (status) => {
  if (status === "OPEN") return "Approved";
  if (status === "UNDER_REVIEW") return "Pending";
  if (status === "REJECTED") return "Rejected";
  if (status === "CLOSED") return "Closed";
};

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

const formatDate = (dateStr) => {
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
};

const viewImage = (images) => {
  currentFile.value = images[0];
  isImage.value = true;
  isModalOpen.value = true;
};

const viewDocument = (documents) => {
  currentFile.value = documents[0];
  isImage.value = false;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const getStatusClass = (status) => {
  if (status === "UNDER_REVIEW") return "text-yellow-500";
  if (status === "OPEN") return "text-green-500";
  if (status === "REJECTED") return "text-red-500";
  if (status === "CLOSED") return "text-blue-500";
};
</script>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.modal-content {
  @apply bg-white p-6 rounded-lg max-w-6xl w-auto relative;
}

.modal-image {
  width: auto;
  max-width: 100%;
  max-height: 80vh;
}

.modal-document {
  width: 700px;
  height: 500px;
  max-height: 90vh;
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.group {
  position: relative;
}

.group-hover\:opacity-100 {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modal-overlay {
  @apply fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center z-50;
}

.close-button {
  @apply bg-red-500 text-white rounded-full px-3 py-1 absolute -top-2 -right-2;
}
</style>
