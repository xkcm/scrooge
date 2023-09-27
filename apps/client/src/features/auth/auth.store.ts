import { revalidateCurrentRoute } from "@/router/router.utils";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useAuthStore = defineStore("authStore", () => {
  const isUserAuthenticated = ref<boolean>(false);

  const setAuthState = (isAuthenticated: boolean) => {
    isUserAuthenticated.value = isAuthenticated;
  };

  watch(isUserAuthenticated, async () => {
    console.info("revalidating");
    await revalidateCurrentRoute();
  });

  return { isUserAuthenticated, setAuthState };
});
