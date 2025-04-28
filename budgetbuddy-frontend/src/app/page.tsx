import Link from "next/link";
import {motion} from "framer-motion"
export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Welcome to Expense Tracker
        </h1>
        <p className="text-slate-600 mb-6">
          Manage your expenses, savings, and connect with the community.
        </p>
        <Link href="/login">
          <button className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition">
            Explore Now
          </button>
        </Link>
      </div>
    </div>
  );
}