<script setup>
import { useAdminStore } from "~/stores/store";

definePageMeta({
  layout: "",
});

const store = useAdminStore();
const { $axios } = useNuxtApp();
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");

const handleSignup = async () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = "All fields are required";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match";
    return;
  }
  try {
    const response = await $axios.post("/auth/local/signup", {
      email: email.value,
      password: password.value,
      passwordConfirm: confirmPassword.value,
      role: "ADMIN",
    });

    store.setToken(response.data.access_token);
    store.setRefreshToken(response.data.refresh_token);
    console.log("success");
    navigateTo("/auth/login");
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Admin Signup</h2>

      <div v-if="errorMessage" class="text-red-500 text-sm mb-4">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSignup">
        <div class="mb-4">
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your email"
          />
        </div>

        <div class="mb-4">
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your password"
          />
        </div>

        <div class="mb-6">
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Confirm Password</label
          >
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Signup
        </button>
      </form>
      Already have an account? <nuxt-link to="/auth/login">Login</nuxt-link>
    </div>
  </div>
</template>
