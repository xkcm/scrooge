import authService from "@/features/auth/auth.service";
import { RouteLocationNormalized } from "vue-router";
import { router } from "./router";

export function validateRoute(route: RouteLocationNormalized) {
  const requireAuthentication = route.matched.some(
    (matched) => matched.meta.requireAuthentication,
  );

  if (requireAuthentication && !authService.isUserAuthenticated()) {
    return { name: "home" };
  }

  const rejectAuthenticatedUsers = route.matched.some(
    (matched) => matched.meta.rejectAuthenticatedUsers,
  );
  if (rejectAuthenticatedUsers && authService.isUserAuthenticated()) {
    return { name: "dashboard" };
  }
}

export async function revalidateCurrentRoute() {
  const validationResult = validateRoute(router.currentRoute.value);
  if (validationResult) {
    return router.replace(validationResult);
  }
}
