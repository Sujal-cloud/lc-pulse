import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function formatDate(date:string){
  const value = new Date(date);

  return value.toLocaleDateString("en-US", {
    month:"short",
    year:"2-digit"
  });
}

function groupByMonth(data: any[]) {
  const monthlyMap: Record<string, any> = {};

  data.forEach((item) => {
    const month = item.date.substring(0, 7);

    monthlyMap[month] = item;
  });

  return Object.values(monthlyMap);
}


function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0].payload;

  const date = new Date(item.date);

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-gray-700 bg-black/90 px-4 py-3 shadow-xl backdrop-blur-md">
      <p className="text-sm text-gray-400">
        {formattedDate}
      </p>

      <p className="mt-1 text-lg font-semibold text-white">
        {item.totalSolved}
        <span className="ml-2 text-sm font-normal text-gray-400">
          problems solved
        </span>
      </p>
    </div>
  );
}

function getYAxisDomain(data: any[]) {
  if (!data.length) {
    return [0, 100];
  }

  const values = data.map((item) => item.totalSolved);

  const min = Math.min(...values);
  const max = Math.max(...values);

  const lower = Math.floor((min - 20) / 50) * 50;
  const upper = Math.ceil((max + 20) / 50) * 50;

  return [lower, upper];
}

function getYAxisTicks(domain: number[]) {
  const [min, max] = domain;

  const ticks = [];

  const step = 50;

  for (let i = min; i <= max; i += step) {
    ticks.push(i);
  }

  return ticks;
}



function ProgressChart() {
    const [data, setData] = useState<any[]>([]);
    const [selectedYear, setSelectedYear] = useState("2026");

    useEffect(() => {

    api.get("/stats/cumulative")
      .then((res) => {
        setData(res.data.data);
      });

    }, []);

    const years = [
    ...new Set(
      data.map((item) => item.date.substring(0, 4))
    )
    ];


    const filteredData = data.filter(
      (item) => item.date.startsWith(selectedYear)
    );
    const monthlyData = groupByMonth(filteredData);
    const yAxisDomain = getYAxisDomain(monthlyData);
    const yAxisTicks = getYAxisTicks(yAxisDomain);

  return (
    <div className="rounded-2xl border border-gray-800 bg-white/5 backdrop-blur-md p-8">
      
      <h2 className="text-xl font-semibold">
        Progress Journey
      </h2>

      <p className="text-gray-400 mt-2">
        Your problem-solving growth over time.
      </p>

        <div className="flex gap-3 mt-6">

            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg border transition ${
                  selectedYear === year
                    ? "border-white bg-white/10"
                    : "border-gray-800 text-gray-400"
                }`}
              >
                {year}
              </button>
            ))}

        </div>

      <div className="mt-8 h-80">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={monthlyData}>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="date"
                tickFormatter={formatDate}
                padding={{ left: 20, right: 20 }}
            />

            <YAxis
              domain={yAxisDomain}
              ticks={yAxisTicks}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="totalSolved"
            />

          </LineChart>

        </ResponsiveContainer>

    </div>

    </div>
  );
}

export default ProgressChart;