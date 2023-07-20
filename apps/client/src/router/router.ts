import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import DashboardPage from "@/features/app/pages/DashboardPage.vue";
import LoginPage from "@/features/auth/pages/LoginPage.vue";
import { validateRoute } from "./router.utils";

const routes: RouteRecordRaw[] = [
  {
    name: "login",
    path: "/login",
    component: LoginPage,
    meta: { rejectAuthenticatedUsers: true },
  },
  {
    name: "home",
    path: "/",
    redirect: "login",
  },
  {
    name: "dashboard",
    path: "/dashboard",
    component: DashboardPage,
    meta: { requireAuthentication: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(validateRoute);

export { router };
