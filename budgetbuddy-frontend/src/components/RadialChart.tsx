'use client';

import { PieChart, Pie, Cell } from 'recharts';

interface RadialChartProps {
  data: {
    name: string;
    value: number;
    color: string;
    icon?: string; // если с бекенда будет приходить emoji-иконка
  }[];
}

export default function RadialChart({ data }: RadialChartProps) {
  // Найдём самую большую категорию для центра
  const topCategory = data.reduce((prev, curr) => (curr.value > prev.value ? curr : prev), data[0]);

  return (
    <div className="relative w-[300px] h-[300px]">
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          innerRadius={90}
          outerRadius={120}
          cornerRadius={20}
          paddingAngle={6}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} radius={50} />
          ))}
        </Pie>
      </PieChart>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="bg-yellow-400 w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow-lg">
          <span className="text-white text-2xl">
            
          </span>
        </div>
        <div className="text-3xl font-bold">{topCategory.value.toLocaleString()} $</div>
        <div className="text-sm text-gray-300">{topCategory.name}</div>
      </div>
    </div>
  );
}

