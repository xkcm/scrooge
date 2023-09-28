// todo: type this better
export type SettingsSectionItemProps = {
  icon: string;
  text: string;
  href?: string;
  onUpdate?: (newValue: any) => void;
  inputType?: "options";
  options?: {
    caption: string;
    value: string;
  }[];
};

export type SettingsSectionProps = {
  header: Pick<SettingsSectionItemProps, "href" | "icon" | "text">;
  items?: SettingsSectionItemProps[];
};
