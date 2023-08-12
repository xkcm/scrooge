import { createPinia } from "pinia";
import { createApp } from "vue";

import GlobalAppWrapper from "@core/pages/GlobalAppWrapperPage.vue";
import "./assets/styles/global.scss";
import { router } from "./router/router";

async function initApp() {
  const vueApp = createApp(GlobalAppWrapper);
  const pinia = createPinia();

  vueApp.use(router);
  vueApp.use(pinia);
  vueApp.mount("#app");
}

initApp();
