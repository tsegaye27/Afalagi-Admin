<template>
  <div class="flex justify-start gap-4">
    <li class="font-medium w-[212px] text-[var(--primary-color)] text-lg">
      {{ label }}:
    </li>
    <span class="text-[var(--primary-color)] font-regular">
      {{ value || "Not Specified" }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String,
});
</script>
