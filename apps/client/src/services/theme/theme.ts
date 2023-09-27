import themesConfig from "@/assets/themes/themes.config.json";
import { useThemeStore } from "./theme.store";
import { SupportedTheme, ThemeConfig } from "./theme.types";

const DEFAULT_THEME = themesConfig[0];

function initTheme(): ThemeConfig {
  return applyTheme(useThemeStore().theme);
}

function applyTheme(themeName: SupportedTheme) {
  const theme = getThemeConfig(themeName);
  document.querySelector(":root")?.setAttribute("data-theme", theme.id);

  return theme;
}

function getThemesConfig() {
  return themesConfig;
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
  applyTheme,
  getThemesConfig,
};

export default themeService;
