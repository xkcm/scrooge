import themesConfig from "@/assets/themes/themes.config.json";
import { useThemeStore } from "./theme.store.js";
import { SupportedTheme, ThemeConfig } from "./theme.types.js";

function initTheme() {
  const themeStore = useThemeStore();
  return themeStore.updateTheme(themeStore.theme);
}

function applyThemeStyling(themeId: SupportedTheme) {
  const theme = getThemeConfig(themeId);
  document.querySelector(":root")?.setAttribute("data-theme", theme.id);
  return theme;
}

function getThemeConfig(themeId: string): ThemeConfig {
  let resolvedThemeId = themeId;
  if (themeId === "system") {
    resolvedThemeId = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  const foundTheme = themesConfig.find(({ id }) => id === resolvedThemeId);
  return foundTheme || themesConfig[0];
}

const themeService = {
  initTheme,
  applyThemeStyling,
  themesConfig,
};

export default themeService;
