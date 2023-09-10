import apiClient from "@/services/api-client/api-client";
import { useAuthStore } from "./auth.store";
import { revalidateCurrentRoute } from "@/router/router.utils";
import notificationService from "../notifications/notification.service";

function isUserAuthenticated() {
  return useAuthStore().isUserAuthenticated;
}

async function resolveAuthState() {
  const userInfo = await apiClient.auth.getAuthState();
  useAuthStore().setAuthState(userInfo.isAuthenticated);
  await revalidateCurrentRoute();

  if (
    !userInfo.isAuthenticated &&
    userInfo.error.code === "api.auth.token.relog_required"
  ) {
    notificationService.pushNotification({
      title: "Session expired",
      type: "info",
      body: "Current session expired, please re-log into the app",
    });
  }

  return userInfo;
}

async function logOut() {
  const userInfo = await apiClient.auth.logOut();
  useAuthStore().setAuthState(userInfo.isAuthenticated);
  await revalidateCurrentRoute();

  return userInfo;
}

async function logIn(mailValue: string, passwordValue: string) {
  const authState = await apiClient.auth.logIn(mailValue, passwordValue);

  useAuthStore().setAuthState(authState.isAuthTokenSet);

  return authState.isAuthTokenSet;
}

const authService = {
  isUserAuthenticated,
  resolveAuthState,
  logOut,
  logIn,
};

export default authService;
