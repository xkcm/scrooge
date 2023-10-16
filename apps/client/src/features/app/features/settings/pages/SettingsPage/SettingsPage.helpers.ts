import * as localeCodes from "locale-codes";
import * as currencyCodes from "currency-codes";

import themeService from "@/services/theme/theme.service";

export const themeOptions = themeService.themesConfig
  .map(({ id, displayName }) => ({
    value: id,
    caption: displayName,
  }))
  .concat([
    {
      caption: "System preference",
      value: "system",
    },
  ]);

// todo: implement this correctly
export const languageOptions = [
  {
    value: "en-US",
    caption: "English",
  },
];

export const currencyOptions = currencyCodes.codes().map((code) => ({
  value: code,
  caption: code,
}));

export const localeOptions = localeCodes.all.map(
  ({ local, name, location, tag }) => ({
    value: tag,
    caption:
      name + (local ? ` - ${local}` : "") + (location ? ` (${location})` : ""),
  }),
);
