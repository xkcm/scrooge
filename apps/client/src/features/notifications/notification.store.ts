import { defineStore } from "pinia";
import { ref } from "vue";

import type { Notification } from "./notification.types";

export const useNotificationStore = defineStore("Notification", () => {
  const items = ref<Notification[]>([]);

  const setItems = (newItems: Notification[]) => {
    items.value = newItems;
  };

  return { items, setItems };
});
