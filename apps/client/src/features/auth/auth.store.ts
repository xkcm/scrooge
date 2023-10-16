import { validateCurrentRoute } from "@/router/router";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useAuthStore = defineStore("Auth", () => {
  const isUserAuthenticated = ref<boolean>(false);

  const setAuthState = (isAuthenticated: boolean) => {
    isUserAuthenticated.value = isAuthenticated;
  };

  watch(isUserAuthenticated, validateCurrentRoute);

  return { isUserAuthenticated, setAuthState };
});
