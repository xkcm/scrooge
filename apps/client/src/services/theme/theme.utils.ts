export function themeColorToRgb(themeColorValue: string) {
  return `rgb(${themeColorValue})`;
}
export function themeColorToRgba(themeColorValue: string, opacity: number = 1) {
  return `rgba(${themeColorValue}, ${opacity})`;
}
