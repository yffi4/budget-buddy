'use client';
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar: React.FC = () => {
  const pathname = usePathname(); // Get the current route

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-gray-100 text-gray-700 p-6 flex flex-col gap-4 h-screen fixed top-0 left-0 shadow-lg"
    >
      <div className="text-xl font-bold text-gray-800 mb-4">Menu</div>
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard">
          <button
            className={`flex items-center gap-3 p-3 rounded-lg text-left w-full ${
              pathname === "/dashboard"
                ? "bg-teal-500 text-white"
                : "bg-gray-200 hover:bg-teal-100"
            } transition-all duration-200 ease-in-out`}
          >
            <span>📊</span> Dashboard
          </button>
        </Link>
        <Link href="/savings">
          <button
            className={`flex items-center gap-3 p-3 rounded-lg text-left w-full ${
              pathname === "/savings"
                ? "bg-teal-500 text-white"
                : "bg-gray-200 hover:bg-teal-100"
            } transition-all duration-200 ease-in-out`}
          >
            <span>💰</span> Savings
          </button>
        </Link>
        <Link href="/AI-assistant">
          <button
            className={`flex items-center gap-3 p-3 rounded-lg text-left w-full ${
              pathname === "/AI-assistant"
                ? "bg-teal-500 text-white"
                : "bg-gray-200 hover:bg-teal-100"
            } transition-all duration-200 ease-in-out`}
          >
            <span>💬</span> AI assistant
          </button>
        </Link>
      </nav>
    </motion.div>
  );
};

export default Sidebar;