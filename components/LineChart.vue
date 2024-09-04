<template>
  <div>
    <LineChart :chart-data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

const chartData = ref({
  labels: [], // Example: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: "User Registrations",
      backgroundColor: "#42A5F5",
      borderColor: "#42A5F5",
      data: [], // Example: [40, 20, 10, 30, 50, 60]
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
