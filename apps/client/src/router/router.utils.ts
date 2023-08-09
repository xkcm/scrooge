import { isUserAuthenticated } from "@/features/auth/auth.service";
import { RouteLocationNormalized } from "vue-router";
import { router } from "./router";

export function validateRoute(route: RouteLocationNormalized) {
  if (route.meta.requireAuthentication && !isUserAuthenticated()) {
    return { name: "home" };
  }
  if (route.meta.rejectAuthenticatedUsers && isUserAuthenticated()) {
    return { name: "dashboard" };
  }
}

export async function revalidateCurrentRoute() {
  const validationResult = validateRoute(router.currentRoute.value);
  if (validationResult) {
    return router.replace(validationResult);
  }
}
