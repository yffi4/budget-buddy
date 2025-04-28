'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import TransactionChart from "@/components/TransactionChart";
import { Transaction } from "@/types/transaction";

const DashboardPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:8000/api/budgets/", {
        headers: { Authorization: `Token ${token}` }
      });

      const transactions: Transaction[] = response.data.map((item: any) => ({
        id: item.id.toString(),
        type: item.type,
        category: item.category_of_expense || item.category_of_income || 'Other',
        amount: Number(item.amount),
        date: item.date
      }));

      setExpenses(transactions.filter(t => t.type === "expense"));
      setIncomes(transactions.filter(t => t.type === "income"));
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTransaction = async (data: Omit<Transaction, "id">) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "http://localhost:8000/api/budgets/",
        {
          type: data.type,
          amount: data.amount,
          date: data.date,
          category_of_expense: data.type === 'expense' ? data.category : undefined,
          category_of_income: data.type === 'income' ? data.category : undefined
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const newTransaction: Transaction = {
        ...response.data,
        id: response.data.id.toString(),
        category: data.category
      };

      if (data.type === 'expense') {
        setExpenses(prev => [...prev, newTransaction]);
      } else {
        setIncomes(prev => [...prev, newTransaction]);
      }
    } catch (err) {
      setError("Failed to add transaction");
    }
  };

  const handleRemoveTransaction = (type: "expense" | "income") => (id: string) => {
    const remove = async () => {
      try {
        await axios.delete(`http://localhost:8000/api/budgets/${id}/`);
        if (type === "expense") {
          setExpenses(prev => prev.filter(t => t.id !== id));
        } else {
          setIncomes(prev => prev.filter(t => t.id !== id));
        }
      } catch (err) {
        setError("Failed to delete transaction");
      }
    };
    remove();
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-slate-800 mb-8"
      >
        Budget Dashboard
      </motion.h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Expenses Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Expenses</h2>
          <TransactionForm type="expense" onAddTransaction={handleAddTransaction} />
          <TransactionList
            transactions={expenses}
            onRemoveTransaction={handleRemoveTransaction("expense")}
          />
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Expense Breakdown</h3>
            <TransactionChart transactions={expenses} />
          </div>
        </div>

        {/* Income Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Income</h2>
          <TransactionForm type="income" onAddTransaction={handleAddTransaction} />
          <TransactionList
            transactions={incomes}
            onRemoveTransaction={handleRemoveTransaction("income")}
          />
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Income Breakdown</h3>
            <TransactionChart transactions={incomes} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;