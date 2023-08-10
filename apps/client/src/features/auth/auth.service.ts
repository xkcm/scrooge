import apiClient from "@/services/api-client/api-client";
import { useAuthStore } from "./auth.store";
import { revalidateCurrentRoute } from "@/router/router.utils";

function isUserAuthenticated() {
  return useAuthStore().isUserAuthenticated;
}

async function resolveAuthState() {
  const userInfo = await apiClient.auth.getAuthState();
  useAuthStore().setAuthState(userInfo.isAuthenticated);
  await revalidateCurrentRoute();

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

const AuthService = {
  isUserAuthenticated,
  resolveAuthState,
  logOut,
  logIn,
};

export default AuthService;
