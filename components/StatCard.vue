<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: Number,
});
</script>
<template>
  <div
    class="flex flex-col items-start border border-[var(--secondary-color)] w-[260px] gap-4 h-[95px] px-3 py-2 bg-white rounded-lg"
  >
    <p class="text-[14px] uppercase text-gray-500">{{ props.title }}</p>
    <div class="flex justify-between w-full items-center">
      <p class="text-[32px] text-gray-700 font-semibold">{{ props.value }}</p>
      <p class="text-[18px] text-green-500 font-medium">+0.00</p>
    </div>
  </div>
</template>
