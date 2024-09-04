<script setup>
import { useAdminStore } from "~/stores/store";
import { ref, onMounted, computed } from "vue";

const store = useAdminStore();
const { $axios } = useNuxtApp();

const countUsers = ref(0);
const countPosts = ref(0);
const newUsers = ref(0);
const genderData = ref({ maleCount: 0, femaleCount: 0 });
const ageGroupsCount = ref({});
const postStatusCounts = ref({});
const missingPersonsInfo = ref({});
const topUserLocations = ref({
  topCountries: {},
  topStates: {},
  topCities: {},
});

onMounted(async () => {
  if (!store.token) {
    navigateTo("/auth/login");
  } else {
    try {
      // Fetch users count
      const userRes = await $axios.get("/user", {
        headers: { Authorization: `Bearer ${store.token}` },
      });
      countUsers.value = userRes.data.totalRecords;

      // Fetch posts count
      const postRes = await $axios.get("/post/advanced", {
        headers: { Authorization: `Bearer ${store.token}` },
      });
      countPosts.value = postRes.data.totalRecords;

      // Fetch new users count for today
      const newUserRes = await $axios.get(
        "/apianalytics/users?timeFrame=today"
      );
      newUsers.value = newUserRes.data.meta.totalUsers;

      // Fetch gender count
      const genderRes = await $axios.get(
        "/apianalytics/users/gender?timeFrame=today"
      );
      genderData.value = genderRes.data.meta.gender;

      // Fetch age groups count
      const ageRes = await $axios.get("/apianalytics/users/age");
      ageGroupsCount.value = ageRes.data.meta.ageGroupsCount;

      // Fetch post status counts
      const postStatusRes = await $axios.get("/apianalytics/posts");
      postStatusCounts.value = postStatusRes.data.meta.statusCount;

      // Fetch missing persons info
      const missingInfoRes = await $axios.get("/apianalytics/posts/info");
      missingPersonsInfo.value = missingInfoRes.data.meta.counts;

      // Fetch top user locations
      const topLocationRes = await $axios.get(
        "/apianalytics/users/top-locations?limit=1"
      );
      topUserLocations.value = topLocationRes.data.meta;
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    }
  }
});

const options = computed(() => {
  return {
    title: {
      text: "User and Post Analytics",
    },
    xAxis: {
      categories: [
        "Total Users",
        "New Users Today",
        "Male Users",
        "Female Users",
      ],
    },
    yAxis: {
      title: {
        text: "Counts",
      },
    },
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
  };
});

const pieOptions = computed(() => {
  return {
    chart: {
      type: "pie",
    },
    title: {
      text: "Post Status Distribution",
    },
    series: [
      {
        name: "Posts",
        colorByPoint: true,
        data: [
          {
            name: "Open Posts",
            y: postStatusCounts.value.openPostsCount,
          },
          {
            name: "Closed Posts",
            y: postStatusCounts.value.closedPostsCount,
          },
          {
            name: "Under Review Posts",
            y: postStatusCounts.value.underReviewPostsCount,
          },
        ],
      },
    ],
  };
});
</script>

<template>
  <div class="flex flex-col pt-8 gap-8 w-full">
    <section>
      <p class="font-medium text-2xl">
        Hello, Tsegaye👋
        <span class="font-regular text-lg text-[#868686]">
          - here is what was happening in Afalagi today
        </span>
      </p>
    </section>
    <section class="flex gap-8">
      <StatCard title="New Users" :value="newUsers" />
      <StatCard title="Total Users" :value="countUsers" />
      <StatCard title="Total Posts" :value="countPosts" />
    </section>
    <section class="mt-8">
      <div class="flex flex-wrap gap-8">
        <div class="w-full md:w-1/2">
          <highchart :options="options" />
        </div>
      </div>
    </section>
  </div>
</template>
