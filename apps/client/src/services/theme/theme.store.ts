import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { getCurrentThemeProperties } from "./theme.helpers";
import { SupportedTheme } from "./theme.types";
import themeService from "./theme";

const DEFAULT_THEME = "system";

export const useThemeStore = defineStore("themeStore", () => {
  const rawTheme = useLocalStorage<SupportedTheme | "">("scrooge-theme", "");
  const theme = computed<SupportedTheme>(() => rawTheme.value || DEFAULT_THEME);

  const setTheme = (themeId: SupportedTheme) => {
    rawTheme.value = themeId;
    themeService.applyTheme(themeId);
  };

  const themeProperties = ref(getCurrentThemeProperties());
  watch(theme, () => (themeProperties.value = getCurrentThemeProperties()));

  return {
    theme,
    setTheme,
    themeProperties,
  };
});
