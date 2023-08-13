export type Operation = {
  title: string;
  date: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  tags: string[];
};
