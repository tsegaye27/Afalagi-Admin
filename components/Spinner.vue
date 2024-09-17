<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="spinner"></div>
  </div>
</template>

<style>
.spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid #ffffff;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
