import apiClient from "@/utils/api-client/api-client";
import { useAuthStore } from "../stores/auth.store.js";
import { revalidateCurrentRoute } from "@/router/router.utils";

export function isUserAuthenticated() {
  return useAuthStore().isUserAuthenticated;
}

export async function resolveAuthState() {
  const userInfo = await apiClient.auth.getAuthState();
  useAuthStore().setAuthState(userInfo.isAuthenticated);
  await revalidateCurrentRoute();

  return userInfo;
}
