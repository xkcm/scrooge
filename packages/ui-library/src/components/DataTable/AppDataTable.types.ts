export type AppDataTableHeaderConfig = {
  caption: string;
  key: string;
  allowSorting?: boolean;
}[];

export type AppDataTableRow = Record<
  string,
  string | number | null | undefined
>;

export type AppDataTableSlots<RowSlotProps> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row(props: RowSlotProps): any;
};
