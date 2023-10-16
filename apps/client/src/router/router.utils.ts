import authService from "@/features/auth/auth.service";
import { RouteLocationNormalized } from "vue-router";

export function validateRoute(route: RouteLocationNormalized) {
  const isUserAuthenticated = authService.isUserAuthenticated();
  const routeRequiresAuth = route.matched.some(
    (matched) => matched.meta.requireAuthentication,
  );
  if (routeRequiresAuth && !isUserAuthenticated) {
    return { name: "login" };
  }

  const routeRejectsAuth = route.matched.some(
    (matched) => matched.meta.rejectAuthenticatedUsers,
  );
  if (routeRejectsAuth && isUserAuthenticated) {
    return { name: "dashboard" };
  }
}
