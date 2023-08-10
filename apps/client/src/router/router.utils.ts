import { RouteLocationNormalized } from "vue-router";
import { router } from "./router";
import AuthService from "@/features/auth/auth.service";

export function validateRoute(route: RouteLocationNormalized) {
  if (route.meta.requireAuthentication && !AuthService.isUserAuthenticated()) {
    return { name: "home" };
  }
  if (
    route.meta.rejectAuthenticatedUsers &&
    AuthService.isUserAuthenticated()
  ) {
    return { name: "dashboard" };
  }
}

export async function revalidateCurrentRoute() {
  const validationResult = validateRoute(router.currentRoute.value);
  if (validationResult) {
    return router.replace(validationResult);
  }
}
