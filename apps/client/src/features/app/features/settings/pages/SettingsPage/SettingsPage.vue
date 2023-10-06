<template>
  <AppLayout>
    <template #header>
      <div class="app-layout__header-wrapper">
        <h2>Settings</h2>
      </div>
    </template>
    <div class="settings-container">
      <div class="settings-wrapper">
        <SettingsSection
          v-for="(section, i) of sections"
          :key="i"
          :header="section.header"
          :items="section.items"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import AppLayout from "@app/layouts/AppLayout.vue";
import { SupportedTheme } from "@/services/theme/theme.types";

import { SettingsSectionProps } from "../../settings.types";
import SettingsSection from "../../components/SettingsSection.vue";
import {
  currencyOptions,
  languageOptions,
  localeOptions,
  themeOptions,
} from "./SettingsPage.helpers";

import { usePreferencesStore } from "../../stores/preferences.store";

const preferencesStore = usePreferencesStore();

const sections: SettingsSectionProps[] = [
  {
    header: {
      icon: "mdi:card-account-details",
      text: "Account info",
      href: "account-info",
    },
  },
  {
    header: {
      icon: "mdi:lock",
      text: "Security",
    },
    items: [
      {
        icon: "mdi:key",
        text: "Change password",
        href: "change-password",
      },
      {
        icon: "mdi:login-variant",
        text: "Sessions",
        href: "sessions",
      },
    ],
  },
  {
    header: {
      icon: "mdi:account-badge",
      text: "Personalization",
    },
    items: [
      {
        icon: "mdi:palette",
        text: "Theme",
        inputType: "options",
        options: themeOptions,
        selectedOption: computed(() => preferencesStore.theme),
        onUpdate: (newTheme: SupportedTheme) =>
          preferencesStore.setTheme(newTheme),
      },
      {
        icon: "mdi:translate",
        text: "Language",
        inputType: "options",
        options: languageOptions,
        selectedOption: computed(() => "en-US"),
        onUpdate: (newLanguage: string) => console.info({ newLanguage }),
      },
      {
        icon: "mdi:currency-usd",
        text: "Currency",
        inputType: "options",
        options: currencyOptions,
        selectedOption: computed(() => preferencesStore.currency),
        onUpdate: (newCurrency: string) =>
          preferencesStore.setCurrency(newCurrency),
      },
      {
        icon: "mdi:flag",
        text: "Locale",
        inputType: "options",
        options: localeOptions,
        selectedOption: computed(() => preferencesStore.locale),
        onUpdate: (newLocale: string) => preferencesStore.setLocale(newLocale),
      },
    ],
  },
];
</script>

<style lang="scss">
.settings-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  // padding-top: 10px;
  padding: 10px 25px 0;
}

.settings-wrapper {
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
}

.app-layout__header-wrapper {
  width: 60%;
  margin: 0 20%;
}
</style>
