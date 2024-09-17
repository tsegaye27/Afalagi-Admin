import { defineStore } from "pinia";

export const useAdminStore = defineStore("admin", () => {
  const token = ref();
  const refreshToken = ref();
  const email = ref();
  const isLoading = ref(false);

  const setToken = (data?: string) => (token.value = data);
  const setRefreshToken = (data?: string) => (refreshToken.value = data);
  const setEmail = (data?: string) => (email.value = data);
  const setLoading = (loading: boolean) => (isLoading.value = loading);

  const logout = () => {
    setToken(), setRefreshToken();
  };

  return {
    token,
    refreshToken,
    email,
    isLoading,
    setToken,
    setLoading,
    setRefreshToken,
    setEmail,
    logout,
  };
});
