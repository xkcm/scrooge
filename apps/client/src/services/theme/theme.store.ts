import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { getCurrentThemeProperties } from "./theme.helpers";
import { SupportedTheme } from "./theme.types";
import themeService from "./theme";

export const useThemeStore = defineStore("themeStore", () => {
  const theme = useLocalStorage<SupportedTheme>("scrooge__theme-id", "light");

  const setTheme = (themeId: SupportedTheme) => {
    theme.value = themeId;
    themeService.setTheme(themeId);
  };

  const themeProperties = ref(getCurrentThemeProperties());
  watch([theme], () => (themeProperties.value = getCurrentThemeProperties()));

  return {
    theme,
    setTheme,
    themeProperties,
  };
});
