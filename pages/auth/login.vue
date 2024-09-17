<script setup>
import { useAdminStore } from "~/stores/store";

definePageMeta({
  layout: "",
});

const store = useAdminStore();
const { $axios } = useNuxtApp();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = "Email and password are required";
    return;
  }
  try {
    const response = await $axios.post("/auth/local/signin", {
      email: email.value,
      password: password.value,
    });
    store.setToken(response.data.access_token);
    store.setRefreshToken(response.data.refresh_token);
    const accessTokenCookie = useCookie("access_token");
    const refreshTokenCookie = useCookie("refresh_token");
    const profileCookie = useCookie("profile");
    const verifiedCookie = useCookie("verified");
    accessTokenCookie.value = response.data.access_token;
    refreshTokenCookie.value = response.data.refresh_token;
    profileCookie.value = response.data.profile;
    verifiedCookie.value = response.data.verified;
    console.log("success");
    navigateTo("/");
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Admin Login</h2>

      <div v-if="errorMessage" class="text-red-500 text-sm mb-4">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
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

        <div class="mb-6">
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

        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </form>
      Don't have an account yet? <nuxt-link to="/auth/signup">Signup</nuxt-link>
    </div>
  </div>
</template>
