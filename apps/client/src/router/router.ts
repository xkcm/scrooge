import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { validateRoute } from "./router.utils";

import LoginPage from "@/features/auth/pages/LoginPage.vue";

import DashboardPage from "@app/features/dashboard/pages/DashboardPage/DashboardPage.vue";
import HistoryPage from "@app/features/history/pages/HistoryPage.vue";
import NewOperationPage from "@app/features/new-operation/pages/NewOperationPage.vue";
import SettingsPage from "@app/features/settings/pages/SettingsPage/SettingsPage.vue";
import SessionsPage from "@app/features/settings/pages/SessionsPage/SessionsPage.vue";
import SessionDetails from "@/features/app/features/settings/pages/SessionDetails.vue";

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
    name: "sessions",
    path: "/settings/sessions",
    component: SessionsPage,
    meta: {
      requireAuthentication: true,
      highlightedNavItem: "settings",
    },
  },
  {
    name: "session-details",
    path: "/settings/session/:sessionId",
    component: SessionDetails,
    meta: {
      requireAuthentication: true,
      highlightedNavItem: "settings",
    },
  },
  {
    name: "new-operation",
    path: "/new-operation",
    component: NewOperationPage,
    meta: { requireAuthentication: true },
    children: [
      {
        name: "new-income",
        path: "income",
        component: NewOperationPage,
      },
      {
        name: "new-expense",
        path: "expense",
        component: NewOperationPage,
      },
    ],
  },
  {
    name: "history",
    path: "/history",
    component: HistoryPage,
    meta: { requireAuthentication: true },
    children: [
      {
        name: "history/item-details",
        path: "operation/:id",
        component: HistoryPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(validateRoute);

export { router };
