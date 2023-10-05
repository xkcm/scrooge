import { usePreferencesStore } from "@/features/app/features/settings/stores/preferences.store";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { getCurrentThemeProperties } from "./theme.helpers";
import themeService from "./theme.service";
import { SupportedTheme } from "./theme.types";

export const useThemeStore = defineStore("Theme", () => {
  const preferencesStore = usePreferencesStore();
  const theme = computed(() => preferencesStore.theme);
  const themeProperties = ref(getCurrentThemeProperties());

  const updateTheme = (themeId: SupportedTheme) => {
    themeService.applyThemeStyling(themeId);
    themeProperties.value = getCurrentThemeProperties();
  };

  watch(() => preferencesStore.theme, updateTheme);

  return {
    theme,
    updateTheme,
    themeProperties,
  };
});
