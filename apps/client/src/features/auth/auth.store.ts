import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", () => {
  const isUserAuthenticated = useLocalStorage<boolean>(
    "scrooge__is-authenticated",
    false,
  );

  const setAuthState = (isAuthenticated: boolean) => {
    isUserAuthenticated.value = isAuthenticated;
  };

  return { isUserAuthenticated, setAuthState };
});
