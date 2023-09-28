import { SupportedTheme } from "@/services/theme/theme.types";
import { schemas } from "@scrooge/shared";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed } from "vue";

// check prisma schema for default values
const DEFAULT_THEME = "system";
const DEFAULT_LOCALE = "en-US";
const DEFAULT_LANGUAGE = "en-US";
const DEFAULT_CURRENCY = "USD";

export const usePreferencesStore = defineStore("Preferences", () => {
  const theme = useLocalStorage<SupportedTheme | null>("scrooge-theme", null);

  const locale = useLocalStorage<schemas.user.UserPreferences["locale"]>(
    "scrooge-locale",
    null,
  );

  const language = useLocalStorage<schemas.user.UserPreferences["language"]>(
    "scrooge-language",
    null,
  );

  const currency = useLocalStorage<schemas.user.UserPreferences["currency"]>(
    "scrooge-currency",
    null,
  );

  const setLocale = (newLocale: schemas.user.UserPreferences["locale"]) =>
    (locale.value = newLocale);
  const setLanguage = (newLanguage: schemas.user.UserPreferences["language"]) =>
    (language.value = newLanguage);
  const setCurrency = (newCurrency: schemas.user.UserPreferences["currency"]) =>
    (currency.value = newCurrency);
  const setTheme = (newTheme: SupportedTheme) => (theme.value = newTheme);

  const setPreferences = (
    preferences: Partial<schemas.user.UserPreferences>,
  ) => {
    if (preferences.currency) setCurrency(preferences.currency);
    if (preferences.language) setLanguage(preferences.language);
    if (preferences.locale) setLocale(preferences.locale);
    if (preferences.theme) setTheme(preferences.theme as SupportedTheme);
  };

  const isCustomized = computed(
    () => theme.value || locale.value || language.value || currency.value,
  );

  return {
    theme: computed(() => theme.value || DEFAULT_THEME),
    locale: computed(() => locale.value || DEFAULT_LOCALE),
    language: computed(() => language.value || DEFAULT_LANGUAGE),
    currency: computed(() => currency.value || DEFAULT_CURRENCY),
    setPreferences,
    setLocale,
    setLanguage,
    setCurrency,
    isCustomized,
  };
});
