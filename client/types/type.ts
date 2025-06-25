interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
  type: "income" | "expense";
}

export type { Expense };
