export interface Transaction {
    id: string;
    type: "expense" | "income";
    category: string;
    amount: number;
    date: string;
  }