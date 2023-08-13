import { RouteLocationNormalized } from "vue-router";
import { router } from "./router";
import AuthService from "@/features/auth/auth.service";
import NotificationService from "@/features/notifications/notification.service";

export function validateRoute(route: RouteLocationNormalized) {
  if (route.meta.requireAuthentication && !AuthService.isUserAuthenticated()) {
    NotificationService.pushNotification({
      title: "Action not allowed",
      type: "warning",
      duration: 20000,
      body: "You have to be logged in to do that.\n You have been redirected to the Log in page",
    });
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
