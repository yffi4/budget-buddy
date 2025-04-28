'use client';
import { motion } from "framer-motion";

interface TabNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { name: "Home", id: "home" },
  { name: "Savings", id: "savings" },
  { name: "Expenses", id: "expenses" },
];

const TabNav: React.FC<TabNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center mb-6"
    >
      <nav className="flex space-x-2 bg-white rounded-lg shadow-sm p-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-teal-500 text-white"
                : "text-slate-600 hover:bg-teal-100"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.name}
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
};

export default TabNav;