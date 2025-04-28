'use client';
import * as React from "react";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Listbox } from "@headlessui/react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

enum Period {
  week = "week",
  month = "month",
  year = "year",
}

type TransactionType = "Income" | "Expense";

interface BarDataItem {
  label: string;
  value: number;
}

interface WeeklyData {
  dayOfWeek: number;
  total: number;
}

const SummaryChart: React.FC = () => {
  const [chartPeriod, setChartPeriod] = useState<Period>(Period.week);
  const [barData, setBarData] = useState<BarDataItem[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentEndDate, setCurrentEndDate] = useState<Date>(new Date());
  const [transactionType, setTransactionType] = useState<TransactionType>("Income");

  useEffect(() => {
    const fetchData = async () => {
      if (chartPeriod === Period.week) {
        const { startDate, endDate } = getWeekRange(currentDate);
        setCurrentEndDate(new Date(startDate));
        try {
          const response = await fetch(
            `/api/weekly-data?startDate=${startDate}&endDate=${endDate}&type=${transactionType}`
          );
          if (!response.ok) throw new Error("Failed to fetch data");
          const data: WeeklyData[] = await response.json();
          const processedData = processWeeklyData(data, transactionType);
          setBarData(processedData);
        } catch (error) {
          console.error("Error fetching data:", error);
          setBarData([]);
        }
      }
    };
    fetchData();
  }, [chartPeriod, currentDate, transactionType]);

  const getWeekRange = (date: Date): { startDate: number; endDate: number } => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return {
      startDate: Math.floor(startOfWeek.getTime()),
      endDate: Math.floor(endOfWeek.getTime()),
    };
  };

  const handlePreviousWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  const handleNextWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const processWeeklyData = (data: WeeklyData[], type: TransactionType): BarDataItem[] => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days.map((day, index) => {
      const dayData = data.find((item) => item.dayOfWeek === index);
      return {
        label: day,
        value: dayData ? dayData.total : 0,
      };
    });
  };

  const chartData = {
    labels: barData.map((item) => item.label),
    datasets: [
      {
        label: transactionType,
        data: barData.map((item) => item.value),
        backgroundColor: transactionType === "Expense" ? "#dc2626" : "#4f46e5",
        borderRadius: 6,
        hoverBackgroundColor: transactionType === "Expense" ? "#b91c1c" : "#4338ca",
      },
    ],
  };

  const totalAmount = barData.reduce((total, item) => total + item.value, 0).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-lg mx-auto bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg"
    >
      <Listbox
        value={chartPeriod}
        onChange={(value: Period) => setChartPeriod(value)}
      >
        <Listbox.Button className="w-full bg-white p-3 rounded-lg shadow-sm text-left flex justify-between items-center hover:bg-gray-50 transition">
          <span className="font-medium text-gray-700">
            {chartPeriod.charAt(0).toUpperCase() + chartPeriod.slice(1)}
          </span>
          <ChevronRight size={16} className="text-gray-400" />
        </Listbox.Button>
        <AnimatePresence>
          <Listbox.Options
            as={motion.ul}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            
            className="mt-2 bg-white shadow-lg rounded-lg absolute w-32 z-10"
          >
            {Object.values(Period).map((period) => (
              <Listbox.Option
                key={period}
                value={period}
                className={({ active }) =>
                  `p-3 cursor-pointer flex items-center transition ${
                    active ? "bg-blue-50 text-blue-600" : "text-gray-700"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    {selected && <Check size={16} className="mr-2 text-blue-500" />}
                    <span className="font-medium">
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </AnimatePresence>
      </Listbox>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl font-semibold text-gray-800 mt-4"
      >
        {currentEndDate.toLocaleDateString("en-US", { month: "short" })}{" "}
        {currentEndDate.getDate()} -{" "}
        {currentDate.toLocaleDateString("en-US", { month: "short" })}{" "}
        {currentDate.getDate()}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-sm text-gray-500 mb-2"
      >
        Total {transactionType === "Expense" ? "Spending" : "Income"}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text"
      >
        ${totalAmount}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 256 }}
        transition={{ duration: 0.6 }}
        className="h-64"
      >
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: "#6b7280" } },
              y: {
                grid: { color: "#e5e7eb" },
                beginAtZero: true,
                ticks: { color: "#6b7280" },
              },
            },
            animation: {
              duration: 800,
              easing: "easeOutCubic",
            },
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex justify-between items-center mt-6"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePreviousWeek}
          className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition"
        >
          <ChevronLeft size={24} />
          <span className="text-xs mt-1 font-medium">Prev week</span>
        </motion.button>
        <Listbox
          value={transactionType}
          onChange={(value: TransactionType) => setTransactionType(value)}
        >
          <Listbox.Button className="w-48 bg-white p-3 rounded-lg shadow-sm text-left flex justify-between items-center hover:bg-gray-50 transition">
            <span className="font-medium text-gray-700">{transactionType}</span>
            <ChevronRight size={16} className="text-gray-400" />
          </Listbox.Button>
          <AnimatePresence>
            <Listbox.Options
              as={motion.ul}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              
              className="mt-2 bg-white shadow-lg rounded-lg absolute w-48 z-10"
            >
              {["Income", "Expense"].map((type) => (
                <Listbox.Option
                  key={type}
                  value={type}
                  className={({ active }) =>
                    `p-3 cursor-pointer flex items-center transition ${
                      active ? "bg-blue-50 text-blue-600" : "text-gray-700"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      {selected && <Check size={16} className="mr-2 text-blue-500" />}
                      <span className="font-medium">{type}</span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </AnimatePresence>
        </Listbox>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextWeek}
          className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition"
        >
          <ChevronRight size={24} />
          <span className="text-xs mt-1 font-medium">Next week</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SummaryChart;