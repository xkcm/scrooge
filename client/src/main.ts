import { createPinia } from "pinia";
import { createApp } from "vue";

import AppWrapper from "@core/layouts/AppWrapperLayout.vue";
import "./assets/styles/global.scss";
import { router } from "./router/router";

async function start() {
  const vueApp = createApp(AppWrapper);
  const pinia = createPinia();

  vueApp.use(router);
  vueApp.use(pinia);
  vueApp.mount("#app");
}

start();
