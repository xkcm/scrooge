export type Operation = {
  title: string;
  createdAt: number;
  amount: number;
  type: "INCOME" | "EXPENSE";
  tags: string[];
};
