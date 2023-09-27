import theme from "@/services/theme/theme";
import { useThemeStore } from "@/services/theme/theme.store";
import { SupportedTheme } from "@/services/theme/theme.types";
import { schemas } from "@scrooge/shared";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed } from "vue";

export const useUserPreferencesStore = defineStore(
  "userPreferencesStore",
  () => {
    const themeStore = useThemeStore();

    const locale = useLocalStorage<schemas.user.UserPreferences["locale"]>(
      "scrooge-locale",
      "",
    );

    const language = useLocalStorage<schemas.user.UserPreferences["language"]>(
      "scrooge-language",
      "",
    );

    const currency = useLocalStorage<schemas.user.UserPreferences["currency"]>(
      "scrooge-currency",
      "",
    );

    const setLocale = (newLocale: string) => (locale.value = newLocale);
    const setLanguage = (newLanguage: string) => (language.value = newLanguage);
    const setCurrency = (newCurrency: string) => (currency.value = newCurrency);
    const setUserPreferences = (
      userPreferences: Partial<schemas.user.UserPreferences>,
    ) => {
      if (userPreferences.currency) setCurrency(userPreferences.currency);
      if (userPreferences.language) setLanguage(userPreferences.language);
      if (userPreferences.locale) setLocale(userPreferences.locale);
      if (userPreferences.theme)
        themeStore.setTheme(userPreferences.theme as SupportedTheme);
    };

    const isInitialized = computed(
      () =>
        themeStore.theme !== "" ||
        locale.value !== "" ||
        language.value !== "" ||
        currency.value !== "",
    );

    return {
      theme,
      locale,
      language,
      currency,
      setUserPreferences,
      setLocale,
      setLanguage,
      setCurrency,
      isInitialized,
    };
  },
);
