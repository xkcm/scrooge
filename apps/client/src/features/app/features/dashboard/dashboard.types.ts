// todo: this type should be sourced from @scrooge/shared
export type Operation = {
  id: string;
  title: string;
  createdAt: number;
  amount: number;
  type: "INCOME" | "EXPENSE";
  tags: string[];
};
