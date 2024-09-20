<template>
  <div class="blog-container">
    <!-- Toaster -->
    <div
      v-if="showToaster"
      :class="toasterType === 'success' ? 'bg-green-500' : 'bg-red-500'"
      class="fixed top-5 right-5 p-4 rounded-lg text-white shadow-lg z-50 transition-all transform ease-out"
    >
      {{ toasterMessage }}
    </div>

    <!-- Success Story Details -->
    <div class="flex items-center m-8">
      <button
        @click="prevPage"
        title="Go back"
        class="flex text-[var(--primary-color)] justify-center items-center mr-[1rem]"
      >
        <Icon name="mdi:arrow-left" size="24px" />
        <span
          class="text-[var(--primary-color)] text-lg font-[poppins] ml-[0.5rem]"
          >Back</span
        >
      </button>
    </div>
    <div
      v-if="story"
      class="blog-post w-full bg-[var(--background-color)] flex flex-col items-center px-[4rem] py-[2rem] mb-[2rem] rounded-lg shadow-md"
    >
      <h2
        class="text-[24px] font-[sora] text-left w-full max-w-[900px] text-[var(--secondary-color)] mt-4"
      >
        {{ story.title }}
      </h2>
      <p
        class="text-[16px] text-[var(--primary-color)] w-full max-w-[900px] mb-[1rem] text-left"
      >
        Posted by: {{ story.user?.Profile.firstName }}
      </p>
      <div class="flex flex-col w-full max-w-[900px] text-left">
        <p class="text-[16px] text-[var(--text-color)] mb-[1rem]">
          {{ story.content }}
        </p>

        <!-- Video Section (Optional) -->
        <div v-if="story.videoUrl" class="my-4">
          <iframe
            class="mb-[1.5rem] rounded-lg"
            width="560"
            height="315"
            :src="story.videoUrl"
            title="Success Story Video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>

        <!-- Like and Share Section -->
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-[1rem]">
            <button
              class="like-button flex items-center gap-[0.5rem]"
              @click="toggleLike(story.id)"
            >
              <Icon
                :name="
                  isLiked(story.id)
                    ? 'heroicons-solid:thumb-up'
                    : 'heroicons-outline:thumb-up'
                "
                :class="isLiked(story.id) ? 'text-blue-500' : 'text-gray-500'"
              />
              <span>{{ likes[story.id] || story.likes.length }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAdminStore } from "#imports";

// State for story details
const story = ref(null);
const likes = ref({});
const likedPosts = ref(new Set());
const store = useAdminStore();

const toasts = ref([]);
const showToaster = ref(false);
const toasterMessage = ref("");
const toasterType = ref("");

const showToast = (message, type) => {
  toasts.value.push({ message, type });
  showToaster.value = true;
  toasterMessage.value = message;
  toasterType.value = type;
  setTimeout(() => {
    showToaster.value = false;
  }, 5000);
};
// Fetch the dynamic story based on storyId
const route = useRoute();
const fetchStoryDetails = async () => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.get(
      `/success-story/${route.params.storyId}`,
      {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      }
    );
    story.value = response.data.data;
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching story details:", error.message);
  }
};

const prevPage = () => {
  const router = useRouter();
  router.back();
};

// Fetch story details on component mount
onMounted(fetchStoryDetails);

// Toggle like state
const toggleLike = async (postId) => {
  if (!store.token) {
    showToast("Please log in to react to posts.", "error");
    navigateTo("/auth/login");
  }

  try {
    const { $axios } = useNuxtApp();
    await $axios.post(`/like/${postId}`, {
      headers: {
        Authorization: `Bearer ${store.token}`,
      },
    });
    if (likedPosts.value.has(postId)) {
      likes.value[postId]--;
      likedPosts.value.delete(postId);
    } else {
      likes.value[postId] = (likes.value[postId] || 0) + 1;
      likedPosts.value.add(postId);
    }
  } catch (error) {
    showToast(error.response.data.message, "error");
    console.error("Error liking post:", error.message);
  }
};

// Check if a post is liked
const isLiked = (postId) => likedPosts.value.has(postId);
</script>

<style scoped>
.blog-container {
  max-width: 1200px;
  margin: 16px auto;
}
.blog-post {
  border: 1px solid #e2e8f0;
}
.like-button {
  cursor: pointer;
}
</style>
