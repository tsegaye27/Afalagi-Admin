<script setup>
import { useAdminStore } from "~/stores/store";

const store = useAdminStore();
const { $axios } = useNuxtApp();

const activeChart = ref("user");

const countUsers = ref(0);
const newUsers = ref(0);
const genderData = ref({ maleCount: 0, femaleCount: 0 });
const postStatusCounts = ref({});
const topLocations = ref({ countries: {}, cities: {} });

const accessTokenCookie = useCookie("access_token");
const refreshTokenCookie = useCookie("refresh_token");

const setCookiesToStore = () => {
  if (accessTokenCookie.value && refreshTokenCookie.value) {
    store.setToken(accessTokenCookie.value);
    store.setRefreshToken(refreshTokenCookie.value);
  }
};

watchEffect(() => {
  setCookiesToStore();
});

onMounted(async () => {
  setCookiesToStore();
  if (setCookiesToStore() && !store.token) {
    navigateTo("/auth/login");
  } else {
    try {
      // Fetch various analytics data
      const userRes = await $axios.get("/user", {
        headers: { Authorization: `Bearer ${store.token}` },
      });
      countUsers.value = userRes.data.data.reduce(
        (acc, user) => (user.Profile ? acc + 1 : acc),
        0
      );
      console.log(countUsers.value);

      const newUserRes = await $axios.get("/analytics/users?timeFrame=today", {
        headers: { Authorization: `Bearer ${store.token}` },
      });
      newUsers.value = newUserRes.data.meta.totalUsers;

      const genderRes = await $axios.get("/analytics/users/gender", {
        headers: { Authorization: `Bearer ${store.token}` },
      });
      genderData.value = genderRes.data.meta.gender;

      const postStatusRes = await $axios.get("/analytics/posts", {
        headers: { Authorization: `Bearer ${store.token}` },
      });
      postStatusCounts.value = postStatusRes.data.meta.statusCount;

      const locationRes = await $axios.get("/analytics/users/top-locations", {
        headers: { Authorization: `Bearer ${store.token}` },
      });
      topLocations.value = locationRes.data.meta;
      console.log(locationRes.data.meta);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    }
  }
});

// Chart options
// const userOptions = computed(() => ({
//   title: { text: "User Analytics" },
//   xAxis: {
//     categories: [
//       "Total Users",
//       "New Users Today",
//       "Male Users",
//       "Female Users",
//     ],
//   },
//   yAxis: { title: { text: "Counts" } },
//   series: [
//     {
//       name: "User Data",
//       data: [
//         countUsers.value,
//         newUsers.value,
//         genderData.value.maleCount,
//         genderData.value.femaleCount,
//       ],
//     },
//   ],
// }));

//make the userOptions with bar chart
const userOptions = computed(() => ({
  chart: { type: "bar" },
  title: { text: "User Analytics" },
  xAxis: {
    categories: [
      "Total Users",
      "New Users Today",
      "Male Users",
      "Female Users",
    ],
  },
  yAxis: { title: { text: "Counts" } },
  series: [
    {
      name: "User Data",
      data: [
        countUsers.value,
        newUsers.value,
        genderData.value.maleCount,
        genderData.value.femaleCount,
      ],
    },
  ],
}));

const setNameFromStatus = (status) => {
  if (status === "openPostsCount") return "Approved";
  if (status === "underReviewPostsCount") return "Pending";
  if (status === "rejectedPostsCount") return "Rejected";
  if (status === "closedPostsCount") return "Closed";
  if (status === "removedPostsCount") return "Removed";
};

const postStatusOptions = computed(() => ({
  chart: { type: "pie" },
  title: { text: "Post Status" },
  series: [
    {
      name: "Post Status",
      colorByPoint: true,
      data: Object.entries(postStatusCounts.value).map(([status, count]) => ({
        name: setNameFromStatus(status),
        y: count,
      })),
    },
  ],
}));

// Pie chart for top countries
const countryPieOptions = computed(() => {
  const countriesData = Object.entries(topLocations.value.topCountries).map(
    ([country, count]) => ({ name: country, y: count })
  );
  return {
    chart: { type: "pie" },
    title: { text: "Top Countries by Reports" },
    series: [
      {
        name: "Countries",
        colorByPoint: true,
        data: countriesData,
      },
    ],
  };
});

// Chart toggling function
const showChart = (chartName) => {
  activeChart.value = chartName;
};
</script>

<template>
  <div class="flex flex-col pt-8 gap-8 w-full">
    <section>
      <p class="font-medium text-2xl">
        Hello, Admin 👋
        <span class="font-regular text-lg text-[#868686]"
          >- Here are today's statistics</span
        >
      </p>
    </section>

    <!-- Chart Filter Buttons -->
    <section class="flex gap-4 mb-4">
      <button
        @click="showChart('user')"
        :class="activeChart === 'user' && 'bg-blue-400'"
        class="btn-primary"
      >
        User Data
      </button>
      <button
        @click="showChart('post')"
        :class="activeChart === 'post' && 'bg-blue-400'"
        class="btn-primary"
      >
        Post Status
      </button>
      <button
        @click="showChart('location')"
        :class="activeChart === 'location' && 'bg-blue-400'"
        class="btn-primary"
      >
        Top Locations
      </button>
    </section>

    <!-- Dynamic Chart Display -->
    <section v-if="activeChart === 'user'" class="w-1/2">
      <highchart :options="userOptions" />
    </section>

    <section v-if="activeChart === 'post'">
      <highchart :options="postStatusOptions" />
    </section>

    <section v-if="activeChart === 'location'">
      <div class="flex flex-wrap gap-8">
        <div class="w-full md:w-1/2">
          <highchart :options="countryPieOptions" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.btn-primary {
  padding: 10px 20px;
  background-color: #3490dc;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.btn-primary:active {
  background-color: #62b7fc;
}
</style>
