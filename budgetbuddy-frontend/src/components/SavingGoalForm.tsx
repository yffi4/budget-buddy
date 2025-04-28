'use client';
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

interface SavingsGoal {
  id: string;
  title: string;
  amount: number;
}

const SavingsGoalForm: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    { id: "1", title: "New Book", amount: 30 },
  ]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const handleCreateGoal = () => {
    if (title && amount) {
      const newGoal: SavingsGoal = {
        id: Date.now().toString(),
        title,
        amount: parseFloat(amount),
      };
      setGoals([...goals, newGoal]);
      setTitle(""); // Очищаем поле ввода
      setAmount(""); // Очищаем поле ввода
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-lg col-span-2"
    >
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Let's Create a Saving's Goal!
      </h2>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Ex: New Car"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border border-slate-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="text"
          placeholder="Ex: $100"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border border-slate-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateGoal}
          className="p-2 bg-teal-500 text-white rounded-lg flex items-center gap-2 hover:bg-teal-600 transition"
        >
          <Plus size={16} /> Create
        </motion.button>
      </div>
      {goals.map((goal) => (
        <div key={goal.id} className="p-3 bg-slate-50 rounded-lg mb-2">
          <p className="text-slate-700">{goal.title}</p>
          <p className="text-slate-800 font-medium">
            Your savings goal is: ${goal.amount}
          </p>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full"
              style={{ width: "0%" }}
            ></div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default SavingsGoalForm;