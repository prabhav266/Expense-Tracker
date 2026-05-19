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

function ExpenseChart({ summary }) {

  if (!summary) return null;

  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [
          summary.income,
          summary.expense
        ],
        backgroundColor: [
          "#34d399",
          "#f87171"
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
        Income vs Expense
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

export default ExpenseChart;