export type Operation = {
  id: string;
  title: string;
  createdAt: number;
  amount: number;
  type: "INCOME" | "EXPENSE";
  tags: string[];
};
