import { ComputedRef } from "vue";
import { AppSelectOption } from "@scrooge/ui-library";

export type SettingsSectionItemLinkProps = {
  href: string;
};

export type SettingsSectionItemOptionsProps = {
  onUpdate: (newValue: any) => void;
  inputType: "options";
  options: AppSelectOption[];
  selectedOption: ComputedRef<string>;
};

export type SettingsSectionItemProps = {
  icon: string;
  text: string;
} & Partial<SettingsSectionItemLinkProps> &
  Partial<SettingsSectionItemOptionsProps>;

export type SettingsSectionProps = {
  header: Pick<SettingsSectionItemProps, "icon" | "text"> &
    Partial<SettingsSectionItemLinkProps>;
  items?: SettingsSectionItemProps[];
};
