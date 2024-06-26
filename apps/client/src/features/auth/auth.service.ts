import apiClient from "@/services/api-client/api-client";

import { usePreferencesStore } from "../app/features/settings/stores/preferences.store";
import notificationService from "../notifications/notification.service";

import { useAuthStore } from "./auth.store";

function isUserAuthenticated() {
  return useAuthStore().isUserAuthenticated;
}

async function resolveAuthState() {
  const authState = (await apiClient.auth
    .getAuthState()
    .catch(console.error)) as any;

  useAuthStore().setAuthState(authState.isAuthenticated);

  if (
    !authState.isAuthenticated &&
    authState.error?.code === "api.auth.token.relog_required"
  ) {
    notificationService.pushNotification({
      title: "Session expired",
      type: "info",
      body: "Current session expired, please re-log into the app",
    });
  }

  const userPreferencesStore = usePreferencesStore();
  if (authState.isAuthenticated && !userPreferencesStore.isCustomized) {
    userPreferencesStore.setPreferences(authState.preferences);
  }

  return authState;
}

async function logOut() {
  const authState = await apiClient.auth.logOut();
  useAuthStore().setAuthState(authState.isAuthenticated);

  return authState;
}

async function logIn(mailValue: string, passwordValue: string) {
  const authState = await apiClient.auth.logIn(mailValue, passwordValue);
  useAuthStore().setAuthState(authState.isAuthenticated);

  return authState.isAuthenticated;
}

const authService = {
  isUserAuthenticated,
  resolveAuthState,
  logOut,
  logIn,
};

export default authService;
