'use client';
import { motion } from "framer-motion";
import SavingsGoalForm from "../../../components/SavingGoalForm";

const SavingsPage: React.FC = () => {
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-semibold text-slate-800 mb-6"
      >
        Savings
      </motion.h1>
      <SavingsGoalForm />
    </div>
  );
};

export default SavingsPage;