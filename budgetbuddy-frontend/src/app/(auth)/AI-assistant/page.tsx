'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TransactionList from "../../../components/TransactionList";
import axios from "axios";
import { Head } from "next/document";
import { Transaction } from "@/types/transaction";

const AssistantPage: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Transaction[]>([]);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Токен отсутствует в localStorage.");
      }
      const response = await axios.get("http://127.0.0.1:8000/api/budgets/", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      const transactions: Transaction[] = response.data;
      setExpenses(transactions.filter((t) => t.type === "expense"));
    } catch (err) {
      setError("Failed to fetch expenses.");
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAiResponse(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Токен отсутствует в localStorage.");
      }
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat/",
        {
          userInput,
          expenses: expenses.map(exp => ({
            category: exp.category,
            amount: exp.amount,
          })),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAiResponse(response.data.answer);
    } catch (err: any) {
      setError("Failed to get AI response. Please try again.");
      console.error("Error fetching AI response:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveExpense = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Токен отсутствует в localStorage.");
      }
      await axios.delete(`/api/budgets/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (err) {
      setError("Failed to remove expense.");
      console.error("Error removing expense:", err);
    }
  };

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-semibold text-slate-800 mb-6"
      >
        AI Assistant
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Expenses and Input Form */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Your Expenses
            </h2>
            <p className="text-slate-600 mb-4">
              Here are your current expenses
            </p>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <TransactionList
                transactions={expenses}
                onRemoveTransaction={handleRemoveExpense}
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Ask the AI Assistant
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="e.g., How can I reduce my entertainment expenses?"
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={4}
              />
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#0D9488" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className={`w-full p-3 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition font-semibold ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Loading..." : "Send"}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Right Column: AI Response */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            AI Assistant Response
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {aiResponse ? (
            <p className="text-slate-600">{aiResponse}</p>
          ) : (
            <p className="text-slate-600">AI-assistant content coming soon...</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AssistantPage;