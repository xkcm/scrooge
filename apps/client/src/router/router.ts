import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { validateRoute } from "./router.utils";

import DashboardPage from "@/features/app/pages/DashboardPage.vue";
import HistoryPage from "@/features/app/pages/HistoryPage.vue";
import NewOperationPage from "@/features/app/pages/NewOperationPage.vue";
import SettingsPage from "@/features/app/pages/SettingsPage.vue";
import LoginPage from "@/features/auth/pages/LoginPage.vue";

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
  {
    name: "settings",
    path: "/settings",
    component: SettingsPage,
    meta: { requireAuthentication: true },
  },
  {
    name: "new-operation",
    path: "/new-operation",
    component: NewOperationPage,
    meta: { requireAuthentication: true },
  },
  {
    name: "history",
    path: "/history",
    component: HistoryPage,
    meta: { requireAuthentication: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(validateRoute);

export { router };
