<script setup>
import { useAdminStore } from "#imports";
import { ref, onMounted, computed } from "vue";

const store = useAdminStore();
const router = useRouter();
const { $axios } = useNuxtApp();
const route = useRoute();

const imagePath = ref("");
const missingPerson = ref({});
const comments = ref([]);
const newComment = ref("");
const postId = route.params.postId;
const showAllComments = ref(false);
const parentId = ref(null);
const replyText = ref("");
const newReply = ref({});

const previousPage = () => {
  router.go(-1);
};

onMounted(async () => {
  store.setLoading(true);
  try {
    const response = await $axios.get(`/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${store.token}`,
      },
    });
    missingPerson.value = response.data.data;
    comments.value = response.data.data.comments;
    replies.value = comments.value.map((comment) =>
      comment.parentId !== null ? replies.value : replies.value
    );
    imagePath.value = `http://localhost:3333/uploads/post/${response.data.data.images[0]}`;
    store.setLoading(false);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    store.setLoading(false);
  }
});

const fetchComments = async () => {
  try {
    const response = await $axios.get(`/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${store.token}`,
      },
    });
    comments.value = response.data.data.comments;
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};

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

const submitComment = async () => {
  if (!store.token) {
    navigateTo("/auth/login");
    return;
  }
  if (!newComment.value.trim()) return;

  try {
    const response = await $axios.post(
      `/comment/post`,
      {
        postId,
        commentText: newComment.value,
        parentId: parentId.value, // Handle parentId for replies
      },
      {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      }
    );

    comments.value.push(response.data.data);
    newComment.value = ""; // Clear input after submission
    parentId.value = null; // Reset parentId after reply submission
    fetchComments();
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};

const replyVisible = ref(null);
const replies = ref({});

// const toggleReply = (commentId) => {
//   replyVisible.value = replyVisible.value === commentId ? null : commentId;
// };

const submitReply = async (parentId) => {
  if (!store.token) {
    navigateTo("/auth/login");
    return;
  }

  if (!replyText.value.trim()) return; // Access replyText.value since it's a ref

  try {
    const response = await $axios.post(
      `/comment/post`,
      {
        postId, // Ensure postId is passed correctly
        commentText: replyText.value, // Use replyText.value
        parentId, // Send parentId to link the reply with the comment
      },
      {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      }
    );

    // Use the response directly (no need for response.json())
    newReply.value = response.data.data;

    // Push the new reply to the comments array
    comments.value.push(newReply.value);

    replyText.value = ""; // Clear the reply input after submission
    replyVisible.value = null; // Hide the reply textarea
    newReply.value = {}; // Reset the newReply object

    fetchComments(); // Optionally refetch comments after reply submission
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};

const getReplies = (parentId) => {
  // Add new reply to the comments array (or send to backend)

  return comments.value.filter((comment) => comment.parentId === parentId);
};

// Reactive state for managing visibility of replies
const replyVisibility = ref({});

// Toggle reply visibility for a specific comment
const toggleReplies = (commentId) => {
  replyVisibility.value[commentId] = !replyVisibility.value[commentId];
};

// Get top-level comments only
const topLevelComments = computed(() => {
  return comments.value.filter((comment) => comment.parentId === null);
});

function getInitials(firstName, lastName) {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
  return `${firstInitial}${lastInitial}`;
}

const visibleComments = computed(() => {
  return topLevelComments.value.slice(0, showAllComments.value ? undefined : 3);
});

function formatArrayText(arr) {
  // Access the first element of the array
  if (!arr) return;
  const text = arr[0];

  // Replace underscores with spaces
  const replacedText = text.replace(/_/g, " ");

  // Capitalize each word
  const formattedText = replacedText
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return formattedText;
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return `${interval} years ago`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months ago`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? "day ago" : "days ago"}`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? "hour ago" : "hours ago"}`;
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} min ago`;
  }
  return `${Math.floor(seconds)} sec ago`;
}
</script>

<template>
  <div>
    <div v-if="store.isLoading"><Spinner /></div>
    <div class="flex items-center m-8">
      <button
        @click="previousPage"
        title="Go back"
        class="flex text-[var(--primary-color)] justify-center items-center mr-[1rem]"
      >
        <Icon name="material-symbols:arrow-left-alt" size="24px" />
        <!-- <span class="text-[var(--primary-color)] font-regular text-lg"
          >Back</span
        > -->
      </button>
    </div>

    <hr />
    <div class="flex flex-col">
      <div class="flex flex-col md:flex-row justify-start my-[2rem] w-full">
        <div
          class="bg-[var(--background-color)] shadow-sm shadow-[var(--primary-color)] rounded-xl p-6 px-4 mx-8 w-full"
        >
          <div class="flex gap-12">
            <!-- Profile Image -->
            <div class="person-image mb-6 md:mb-0 md:mr-6">
              <img
                class="w-[500px] h-[500px] object-cover rounded-lg"
                :src="imagePath"
                alt="missing_person"
              />
            </div>

            <!-- Main Details -->
            <div>
              <ul class="flex flex-col w-[450px] gap-4">
                <DetailsRow
                  label="Full Name"
                  :value="`${missingPerson.firstName} ${missingPerson.middleName} ${missingPerson.lastName}`"
                />
                <DetailsRow
                  label="Date of Birth"
                  :value="formatDate(missingPerson.dateOfBirth)"
                />
                <DetailsRow
                  label="Gender"
                  :value="missingPerson.gender?.toLowerCase()"
                />
                <DetailsRow
                  label="Nationality"
                  :value="missingPerson.nationality?.toLowerCase()"
                />
                <DetailsRow
                  label="Hair Color"
                  :value="missingPerson.hairColor?.toLowerCase()"
                />
                <DetailsRow
                  label="Skin Color"
                  :value="missingPerson.skinColor?.toLowerCase()"
                />
                <DetailsRow label="Height" :value="missingPerson.height" />
                <DetailsRow
                  label="Last Seen Wearing"
                  :value="missingPerson.lastSeenWearing"
                />
                <DetailsRow
                  label="Last Seen Location"
                  :value="missingPerson.lastSeenLocation"
                />
                <DetailsRow
                  label="Last Seen Date"
                  :value="formatDate(missingPerson.lastSeenDate)"
                />
                <DetailsRow
                  label="Description"
                  :value="missingPerson.description"
                />
                <DetailsRow
                  label="Recognizable Features"
                  :value="missingPerson.recognizableFeatures"
                />
              </ul>
            </div>

            <!-- Additional Details (Right Side) -->
            <div>
              <ul class="flex flex-col w-[380px] gap-4">
                <DetailsRow
                  label="Education"
                  :value="missingPerson.educationalLevel?.toLowerCase()"
                />
                <DetailsRow
                  label="Language Spoken"
                  :value="missingPerson.languageSpoken"
                />
                <DetailsRow
                  label="Marital Status"
                  :value="missingPerson.maritalStatus?.toLowerCase()"
                />
                <DetailsRow
                  label="Physical Disability"
                  :value="formatArrayText(missingPerson.physicalDisability)"
                />
                <DetailsRow
                  label="Mental Disability"
                  :value="formatArrayText(missingPerson.mentalDisability)"
                />
                <DetailsRow
                  label="Medical Condition"
                  :value="formatArrayText(missingPerson.medicalIssues)"
                />
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        class="w-[1230px] bg-[var(--background-color)] mx-8 px-4 my-4 rounded-xl shadow-sm shadow-[var(--primary-color)] p-6"
      >
        <!-- Card Container -->
        <div class="flex gap-8">
          <!-- Video Section -->
          <div
            class="video-section flex flex-col justify-start items-center w-3/5"
          >
            <video class="w-full h-[550px] rounded-md" controls src=""></video>
            <h1
              class="text-[24px] w-full text-left text-[var(--primary-color)] font-medium font-[sora] mt-[1rem]"
            >
              Message from his {{ missingPerson.posterRelation?.toLowerCase() }}
            </h1>
          </div>

          <!-- Comments Section -->
          <div
            class="comments-section p-[1rem] w-2/5 h-[550px] overflow-y-auto flex-1 border border-[var(--secondary-color)] rounded"
          >
            <h2
              class="text-[20px] text-[var(--primary-color)] font-medium mb-[1rem]"
            >
              Comments ({{ topLevelComments.length }})
            </h2>

            <div
              v-if="!topLevelComments.length"
              class="text-[var(--primary-color)]"
            >
              No comments yet. Be the first to comment!
            </div>

            <div class="overflow-y-auto">
              <!-- Comment List -->
              <div
                v-for="comment in visibleComments"
                :key="comment.id"
                class=""
              >
                <div
                  class="flex items-center gap-[1rem] p-2 border-b-[1.1px] border-[var(--primary-color)]"
                >
                  <div
                    class="w-10 h-9 rounded-full bg-green-500 text-white flex items-center justify-center text-md font-bold"
                  >
                    {{
                      getInitials(
                        comment.user?.Profile.firstName,
                        comment.user?.Profile.lastName
                      )
                    }}
                  </div>
                  <div class="flex flex-col w-full">
                    <p class="text-[var(--primary-color)] font-medium">
                      {{ comment.user?.Profile.firstName }}
                      {{ comment.user?.Profile.lastName }}
                      <span class="text-[var(--secondary-color)] font-light">{{
                        comment.user.email
                      }}</span>
                    </p>
                    <p class="text-[var(--text-color)]">
                      {{ comment.commentText }}
                    </p>
                    <div class="flex items-center justify-between mt-1">
                      <p class="text-[#868686] whitespace-nowrap">
                        {{ timeAgo(comment.createdAt) }}
                      </p>
                      <div class="flex items-center gap-4">
                        <!-- View Replies Button -->
                        <button
                          v-if="getReplies(comment.id).length > 0"
                          @click="toggleReplies(comment.id)"
                          class="text-[var(--primary-color)] whitespace-nowrap"
                        >
                          {{
                            replyVisibility[comment.id]
                              ? "Hide Replies"
                              : "View Replies"
                          }}({{ getReplies(comment.id).length }})
                        </button>
                        <!-- Reply Button -->
                        <button
                          @click="replyVisible = comment.id"
                          @dblclick="replyVisible = null"
                          title="reply"
                          class="flex items-center text-[var(--primary-color)] hover:text-[var(--secondary-color)]"
                        >
                          <Icon name="heroicons-solid:reply" size="22px" />
                        </button>
                      </div>
                    </div>

                    <!-- Reply Textarea -->
                    <div
                      v-if="replyVisible === comment.id"
                      class="ml-[2rem] mt-[1rem] flex flex-col"
                    >
                      <textarea
                        v-model="replyText"
                        disabled
                        class="w-full p-2 ring ring-[var(--secondary-color)] outline-none bg-[var(--background-color)] text-[var(--primary-color)] rounded"
                        rows="1"
                        placeholder="Write your reply..."
                      ></textarea>
                      <button
                        @click="submitReply(comment.id)"
                        disabled
                        class="px-4 py-2 w-[8rem] bg-[#868686] cursor-not-allowed text-white rounded mt-[0.5rem]"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Display Replies -->
                <div v-if="replyVisibility[comment.id]" class="ml-[2rem]">
                  <div
                    v-for="reply in getReplies(comment.id)"
                    :key="reply.id"
                    class="my-[0.5rem]"
                  >
                    <div
                      class="flex items-center p-2 gap-[1rem] border-b border-[var(--primary-color)]"
                    >
                      <div
                        class="w-10 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-md font-bold"
                      >
                        {{
                          getInitials(
                            reply.user?.Profile.firstName,
                            reply.user?.Profile.lastName
                          )
                        }}
                      </div>
                      <div class="flex flex-col w-full">
                        <p class="text-[var(--primary-color)] font-medium">
                          {{ reply.user?.Profile.firstName }}
                          {{ reply.user?.Profile.lastName }}
                          <span
                            class="text-[var(--secondary-color)] font-light"
                            >{{ reply.user.email }}</span
                          >
                        </p>
                        <p class="text-[var(--primary-color)]">
                          {{ reply.commentText }}
                        </p>
                        <p class="text-[#868686] whitespace-nowrap">
                          {{ timeAgo(reply.createdAt) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Toggle View More/Less Comments -->
              <button
                v-if="comments.length > 3"
                @click="showAllComments = !showAllComments"
                class="text-[var(--primary-color)] mt-4"
              >
                {{ showAllComments ? "View Less" : "View More" }}
              </button>
            </div>

            <!-- Add Comment -->
            <div class="mt-[2rem]">
              <textarea
                v-model="newComment"
                class="w-full p-2 ring ring-[var(--secondary-color)] outline-none bg-[var(--background-color)] text-[var(--text-color)] rounded"
                rows="1"
                disabled
                placeholder="Write your comment..."
              ></textarea>
              <button
                @click="submitComment"
                disabled
                class="px-4 py-2 w-[8rem] bg-[#868686] cursor-not-allowed text-white rounded mt-[0.5rem]"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
