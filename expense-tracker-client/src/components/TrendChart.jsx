import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function TrendChart({ transactions }) {

  if (!transactions || transactions.length === 0) return null;

  // Sort oldest -> newest
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const labels = sorted.map((t) =>
    new Date(t.date || t.createdAt).toLocaleDateString()
  );

  const incomeData = sorted.map((t) =>
    t.type === "income" ? t.amount : 0
  );

  const expenseData = sorted.map((t) =>
    t.type === "expense" ? t.amount : 0
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: "#34d399",
        backgroundColor: "#34d399",
        tension: 0.4
      },
      {
        label: "Expense",
        data: expenseData,
        borderColor: "#f87171",
        backgroundColor: "#f87171",
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#d0d0e8"
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#8b8ba7"
        },
        grid: {
          color: "#1e1e2a"
        }
      },
      y: {
        ticks: {
          color: "#8b8ba7"
        },
        grid: {
          color: "#1e1e2a"
        }
      }
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: "24px"
      }}
    >
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#e8e8f0",
          marginBottom: "20px"
        }}
      >
        Transaction Trends
      </h3>

      <Line
        data={data}
        options={options}
      />
    </div>
  );
}

export default TrendChart;