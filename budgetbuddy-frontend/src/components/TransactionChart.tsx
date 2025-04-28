'use client';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Transaction } from "@/types/transaction";

ChartJS.register(ArcElement, Tooltip, Legend);

const generateColors = (count: number) => {
  const baseColors = [
    "#FF6B6B", "#4ECDC4", "#FFD700", "#A855F7",
    "#34D399", "#F97316", "#EC4899", "#3B82F6"
  ];
  return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
};

interface TransactionChartProps {
  transactions: Transaction[];
}

const TransactionChart: React.FC<TransactionChartProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return <div className="p-4 text-center text-gray-500">No data available</div>;
  }

  const categoryData = transactions.reduce((acc, transaction) => {
    const category = transaction.category || 'Other';
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(categoryData).map(c => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: generateColors(Object.keys(categoryData).length),
      borderWidth: 1,
      hoverOffset: 20
    }]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: { size: 14 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(value)}`;
          }
        }
      }
    }
  };

  return (
    <div className="h-96 w-full">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default TransactionChart;