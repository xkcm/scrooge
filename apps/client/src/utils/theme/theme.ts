import themesConfig from "@/assets/themes/themes.config.json";
import { ThemeConfig } from "./theme.types";
import localStorageUtil from "@/utils/local-storage/local-storage.util";

const DEFAULT_THEME = themesConfig[0];

export function initTheme(): ThemeConfig {
  return setTheme(getInitThemeName());
}

export function setTheme(themeName: string) {
  const theme = getThemeConfig(themeName);

  document.querySelector(":root")?.setAttribute("data-theme", theme.id);
  localStorageUtil.setItem("scrooge__theme-id", theme.id);

  return theme;
}

export function getThemesConfig() {
  return themesConfig;
}

function getInitThemeName(): string {
  return localStorageUtil.getItem("scrooge__theme-id") || DEFAULT_THEME.id;
}

function getThemeConfig(themeName: string): ThemeConfig {
  const foundTheme = themesConfig.find(({ id }) => id === themeName);

  if (!foundTheme) {
    return DEFAULT_THEME;
  }

  return foundTheme;
}
