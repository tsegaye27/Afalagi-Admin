<template>
  <div>
    <PieChart :chart-data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const chartData = ref({
  labels: ["Active Posts", "Inactive Posts"], // Example: Customize based on your data
  datasets: [
    {
      backgroundColor: ["#FF6384", "#36A2EB"],
      data: [300, 50], // Example: Customize based on your data
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

onMounted(() => {
  // Fetch data from API or define data here
});
</script>
