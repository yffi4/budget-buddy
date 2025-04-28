'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { Transaction } from "@/types/transaction";

interface TransactionFormProps {
  onAddTransaction: (data: Omit<Transaction, "id">) => void;
  type: "expense" | "income";
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction, type }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    
    if (!category || isNaN(parsedAmount) || parsedAmount <= 0 || !date) {
      alert("Please fill all fields correctly");
      return;
    }

    onAddTransaction({
      type,
      category,
      amount: parsedAmount,
      date
    });

    setCategory("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const categories = type === "expense"
    ? [
        { value: "food", label: "Food" },
        { value: "health", label: "Health" },
        { value: "housing", label: "Housing" },
        { value: "entertainment", label: "Entertainment" },
        { value: "transport", label: "Transport" },
        { value: "travel", label: "Travel" },
        { value: "other", label: "Other" },
      ]
    : [
        { value: "investments", label: "Investments" },
        { value: "salary", label: "Salary" },
        { value: "freelance", label: "Freelance" },
      ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">
      <div className="flex gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 flex-1"
          required
        >
          <option value="" disabled>Select Category</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder={`${type === "expense" ? "Ex." : "Inc."}: $20`}
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
          className="p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-32"
          inputMode="decimal"
          required
        />
      </div>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        required
      />
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "#0D9488" }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="p-3 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition font-semibold"
      >
        Add
      </motion.button>
    </form>
  );
};

export default TransactionForm;