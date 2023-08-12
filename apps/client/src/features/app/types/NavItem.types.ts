export type NavItemProps = {
  caption: string;
  icon: string;
  to?: { name: string };
  onClick?: (event: MouseEvent) => void;
};
