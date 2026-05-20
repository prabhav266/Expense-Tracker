import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function CategoryChart({ transactions }) {

  if (!transactions || transactions.length === 0) {
    return null;
  }

  // Only expenses
  const expenses = transactions.filter(
    (t) => t.type === "expense"
  );

  // Group by category
  const grouped = {};

  expenses.forEach((t) => {

    if (!grouped[t.category]) {
      grouped[t.category] = 0;
    }

    grouped[t.category] += t.amount;
  });

  const labels = Object.keys(grouped);

  const values = Object.values(grouped);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#6c63ff",
          "#34d399",
          "#f87171",
          "#fbbf24",
          "#38bdf8",
          "#a78bfa",
          "#fb7185",
          "#2dd4bf"
        ],
        borderWidth: 0
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#d0d0e8"
        }
      }
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: "24px",
        marginBottom: "28px"
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
        Expense Categories
      </h3>

      <div
        style={{
          height: "320px",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Doughnut
          data={data}
          options={options}
        />
      </div>
    </div>
  );
}

export default CategoryChart;