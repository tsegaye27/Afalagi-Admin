import { defineStore } from "pinia";

export const useAdminStore = defineStore("admin", () => {
  const token = ref();
  const refreshToken = ref();
  const email = ref();

  const setToken = (data?: string) => (token.value = data);
  const setRefreshToken = (data?: string) => (refreshToken.value = data);
  const setEmail = (data?: string) => (email.value = data);

  const logout = () => {
    setToken(), setRefreshToken();
  };

  return {
    token,
    refreshToken,
    email,
    setToken,
    setRefreshToken,
    setEmail,
    logout,
  };
});
