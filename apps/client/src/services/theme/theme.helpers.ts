export function getColorVariableName(
  colorName: string,
  options?: {
    weight?: 400 | 500 | 600 | "off";
    text?: boolean;
  },
) {
  return `--${options?.text ? "text-" : ""}color-${colorName}${
    options?.weight
      ? options.weight === "off"
        ? ""
        : `-${options.weight}`
      : "-400"
  }`;
}

export function getComputedColorWeights(
  colorName: string,
  computedStyle: CSSStyleDeclaration,
) {
  return {
    400: computedStyle.getPropertyValue(
      getColorVariableName(colorName, { weight: 400 }),
    ),
    500: computedStyle.getPropertyValue(
      getColorVariableName(colorName, { weight: 500 }),
    ),
    600: computedStyle.getPropertyValue(
      getColorVariableName(colorName, { weight: 600 }),
    ),
  };
}

export const getCurrentThemeProperties = (
  computedStyle: CSSStyleDeclaration = getComputedStyle(document.body),
) => ({
  colors: {
    alpha: getComputedColorWeights("alpha", computedStyle),
    beta: getComputedColorWeights("beta", computedStyle),
    delta: getComputedColorWeights("delta", computedStyle),
    gamma: getComputedColorWeights("gamma", computedStyle),
    red: computedStyle.getPropertyValue(getColorVariableName("red")),
    green: computedStyle.getPropertyValue(getColorVariableName("green")),
    error: computedStyle.getPropertyValue(getColorVariableName("error")),
    success: computedStyle.getPropertyValue(getColorVariableName("success")),
    info: computedStyle.getPropertyValue(getColorVariableName("info")),
    warning: computedStyle.getPropertyValue(getColorVariableName("warning")),
  },
  textColors: {
    primary: computedStyle.getPropertyValue(
      getColorVariableName("primary", { text: true, weight: "off" }),
    ),
    secondary: computedStyle.getPropertyValue(
      getColorVariableName("secondary", { text: true, weight: "off" }),
    ),
    dark: computedStyle.getPropertyValue(
      getColorVariableName("dark", { text: true, weight: "off" }),
    ),
    light: computedStyle.getPropertyValue(
      getColorVariableName("light", { text: true, weight: "off" }),
    ),
  },
});
