import themesConfig from "@/assets/themes/themes.config.json";
import { SupportedTheme, ThemeConfig } from "./theme.types";
import localStorageUtil from "@/services/local-storage/local-storage.util";

const DEFAULT_THEME = themesConfig[0];

function initTheme(): ThemeConfig {
  return setTheme(getInitThemeName());
}

function setTheme(themeName: SupportedTheme) {
  const theme = getThemeConfig(themeName);

  document.querySelector(":root")?.setAttribute("data-theme", theme.id);
  localStorageUtil.setItem("scrooge__theme-id", theme.id);

  return theme;
}

function getThemesConfig() {
  return themesConfig;
}

function getInitThemeName(): SupportedTheme {
  return (
    (localStorageUtil.getItem("scrooge__theme-id") as SupportedTheme) ||
    DEFAULT_THEME.id
  );
}

function getThemeConfig(themeName: string): ThemeConfig {
  const foundTheme = themesConfig.find(({ id }) => id === themeName);

  if (!foundTheme) {
    return DEFAULT_THEME;
  }

  return foundTheme;
}

const themeService = {
  initTheme,
  setTheme,
  getThemesConfig,
};

export default themeService;
