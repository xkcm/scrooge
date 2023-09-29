<template>
  <AppLayout header-text="Settings">
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
import * as localeCodes from "locale-codes";
import * as currencyCodes from "currency-codes";
import AppLayout from "@app/layouts/AppLayout.vue";
import SettingsSection from "../components/SettingsSection.vue";
import { SettingsSectionProps } from "../settings.types";
import themeService from "@/services/theme/theme.service";
import { usePreferencesStore } from "../stores/preferences.store";
import { SupportedTheme } from "@/services/theme/theme.types";

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
        options: themeService.themesConfig.map(({ id, displayName }) => ({
          value: id,
          caption: displayName,
          selected: preferencesStore.theme === id,
        })),
        onUpdate: (newTheme: SupportedTheme) =>
          preferencesStore.setTheme(newTheme),
      },
      {
        icon: "mdi:translate",
        text: "Language",
        inputType: "options",
        // todo: implement this correctly
        options: [
          {
            value: "en-US",
            caption: "English",
            selected: true,
          },
        ],
        onUpdate: (newLanguage) => console.info({ newLanguage }),
      },
      {
        icon: "mdi:currency-usd",
        text: "Currency",
        inputType: "options",
        options: currencyCodes.codes().map((code) => ({
          value: code,
          caption: code,
          selected: preferencesStore.currency === code,
        })),
        onUpdate: (newCurrency: string) =>
          preferencesStore.setCurrency(newCurrency),
      },
      {
        icon: "mdi:flag",
        text: "Locale",
        inputType: "options",
        options: localeCodes.all.map(({ local, name, location, tag }) => ({
          value: tag,
          caption:
            name +
            (local ? ` - ${local}` : "") +
            (location ? ` (${location})` : ""),
          selected: preferencesStore.locale === tag,
        })),
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
  padding-top: 10px;
}

.settings-wrapper {
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
