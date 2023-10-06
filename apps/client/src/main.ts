import { createPinia } from "pinia";
import { createApp } from "vue";

import GlobalAppWrapper from "@core/pages/GlobalAppWrapperPage.vue";
import "./assets/styles/global.scss";
import { router } from "./router/router";

import "@scrooge/ui-library/css";
import themeService from "./services/theme/theme.service";
import authService from "./features/auth/auth.service";
import fontLoaderService from "./services/font-loader/font-loader";

async function initApp() {
  const vueApp = createApp(GlobalAppWrapper);
  const pinia = createPinia();

  vueApp.use(pinia);

  await authService.resolveAuthState();
  themeService.initTheme();
  await fontLoaderService.loadFonts();

  vueApp.use(router);
  vueApp.mount("#app");
}

initApp();
