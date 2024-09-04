<script setup>
import { useAdminStore } from "~/stores/store";

const store = useAdminStore();
const { $axios } = useNuxtApp();
const countUsers = ref(0);
const countPosts = ref(0);

onMounted(async () => {
  if (!store.token) {
    navigateTo("/auth/login");
  } else {
    try {
      const userRes = await $axios.get("/user", {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
      countUsers.value = userRes.data.totalRecords;

      const postRes = await $axios.get("/post/advanced", {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
      countPosts.value = postRes.data.totalRecords;

      // Fetch data for charts here
      // Update chart data refs in LineChart and PieChart components
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    }
  }
});

const options = computed(() => {
  return {
    title: {
      text: "Growth of Internet Users Worldwide (logarithmic scale)",
    },

    accessibility: {
      point: {
        valueDescriptionFormat: "{xDescription}{separator}{value} million(s)",
      },
    },

    xAxis: {
      title: {
        text: "Year",
      },
      categories: [1995, 2000, 2005, 2010, 2015, 2020, 2023],
    },

    yAxis: {
      type: "logarithmic",
      title: {
        text: "Number of Internet Users (in millions)",
      },
    },

    tooltip: {
      headerFormat: "<b>{series.name}</b><br />",
      pointFormat: "{point.y} million(s)",
    },

    series: [
      {
        name: "Internet Users",
        keys: ["y", "color"],
        data: [
          [16, "#0000ff"],
          [361, "#8d0073"],
          [1018, "#ba0046"],
          [2025, "#d60028"],
          [3192, "#eb0014"],
          [4673, "#fb0004"],
          [5200, "#ff0000"],
        ],
        color: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 1,
            y2: 0,
          },
          stops: [
            [0, "#0000ff"],
            [1, "#ff0000"],
          ],
        },
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
      <StatCard title="New Users" :value="0" />
      <StatCard title="Total Users" :value="countUsers" />
      <StatCard title="New Posts" :value="0" />
      <StatCard title="Total Posts" :value="countPosts" />
    </section>
    <section class="mt-8">
      <div class="flex flex-wrap gap-8">
        <div class="w-full md:w-1/2">
          <highchart :options="options" />
          <!-- <LineChart /> -->
        </div>
        <div class="w-full md:w-1/2">
          <!-- <PieChart /> -->
        </div>
      </div>
    </section>
  </div>
</template>
