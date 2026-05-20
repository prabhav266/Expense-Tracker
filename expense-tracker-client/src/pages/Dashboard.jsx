import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import ExpenseChart from "../components/ExpenseChart";
import TrendChart from "../components/TrendChart";
import CategoryChart from "../components/CategoryChart";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun
} from "docx";

import { saveAs } from "file-saver";

function formatAmount(n) {
  return new Intl.NumberFormat("en-IN").format(Math.abs(n));
}

function SummaryCard({ label, amount, color, icon, sub }) {
  return (
    <div className="card" style={{
      padding: "22px 24px",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "default"
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 32px ${color}18`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Decorative glow */}
      <div style={{
        position: "absolute", top: "-30px", right: "-30px",
        width: "100px", height: "100px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        pointerEvents: "none"
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#5a5a7a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
            {label}
          </p>
          <p style={{ fontSize: "26px", fontWeight: 800, color, letterSpacing: "-0.02em" }}>
            ₹{formatAmount(amount)}
          </p>
          {sub && (
            <p style={{ fontSize: "11px", color: "#3a3a50", marginTop: "4px" }}>{sub}</p>
          )}
        </div>
        <div style={{
          width: "40px", height: "40px", borderRadius: "10px",
          background: `${color}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px", flexShrink: 0
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filter, setFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [dateFilter, setDateFilter] = useState("all");
  const [showDownloadMenu, setShowDownloadMenu] =
  useState(false);
  const navigate = useNavigate();

  const fetchSummary = async () => {
  try {

    const summaryRes = await api.get("/transactions/summary");
    setSummary(summaryRes.data);

    const txRes = await api.get("/transactions?page=1&limit=50");
    setTransactions(txRes.data);

  } catch (err) {
    console.error(err.response?.data);
  }
};

  const refreshAll = () => {
    fetchSummary();
    setRefreshKey((prev) => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    refreshAll();
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const balancePositive = summary ? summary.balance >= 0 : true;
  const handleExportCSV = async () => {

  try {

    const res = await api.get(
      "/transactions?page=1&limit=1000"
    );

    const transactions = res.data;

    const headers = [
      "Date",
      "Type",
      "Category",
      "Amount",
      "Currency",
      "Note"
    ];

    const rows = transactions.map((t) => [

      new Date(
        t.date || t.createdAt
      ).toLocaleDateString(),

      t.type,

      t.category,

      t.amount,

      t.currency,

      t.note || ""

    ]);

    const csvContent = [

      headers.join(","),

      ...rows.map((r) => r.join(","))

    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;"
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "transactions.csv"
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  } catch (err) {

    console.error(err);

  }
};

const handleExportExcel = async () => {

  try {

    const res = await api.get(
      "/transactions?page=1&limit=1000"
    );

    const transactions = res.data;

    const data = transactions.map((t) => ({
      Date: new Date(
        t.date || t.createdAt
      ).toLocaleDateString(),

      Type: t.type,

      Category: t.category,

      Amount: t.amount,

      Currency: t.currency,

      Note: t.note || ""
    }));

    const worksheet =
      XLSX.utils.json_to_sheet(data);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Transactions"
    );

    XLSX.writeFile(
      workbook,
      "transactions.xlsx"
    );

  } catch (err) {

    console.error(err);

  }
};

const handleExportPDF = async () => {

  try {

    const res = await api.get(
      "/transactions?page=1&limit=1000"
    );

    const transactions = res.data;

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Expense Tracker Report",
      14,
      20
    );

    const tableData =
      transactions.map((t) => [

        new Date(
          t.date || t.createdAt
        ).toLocaleDateString(),

        t.type,

        t.category,

        `${t.currency} ${t.amount}`,

        t.note || ""

      ]);

    autoTable(doc, {

      head: [[
        "Date",
        "Type",
        "Category",
        "Amount",
        "Note"
      ]],

      body: tableData,

      startY: 30

    });

    doc.save("transactions.pdf");

  } catch (err) {

    console.error(err);

  }
};

const handleExportDOCX = async () => {

  try {

    const res = await api.get(
      "/transactions?page=1&limit=1000"
    );

    const transactions = res.data;

    const rows = transactions.map((t) => (

      new TableRow({

        children: [

          new TableCell({
            children: [
              new Paragraph(
                new Date(
                  t.date || t.createdAt
                ).toLocaleDateString()
              )
            ]
          }),

          new TableCell({
            children: [
              new Paragraph(t.type)
            ]
          }),

          new TableCell({
            children: [
              new Paragraph(t.category)
            ]
          }),

          new TableCell({
            children: [
              new Paragraph(
                `${t.currency} ${t.amount}`
              )
            ]
          })

        ]

      })

    ));

    const doc = new Document({

      sections: [{
        children: [

          new Paragraph({
            text: "Expense Tracker Report",
            heading: "Heading1"
          }),

          new Table({
            rows
          })

        ]
      }]
    });

    const blob =
      await Packer.toBlob(doc);

    saveAs(
      blob,
      "transactions.docx"
    );

  } catch (err) {

    console.error(err);

  }
};

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f13" }}>
      {/* Top Nav */}
      <nav style={{
        background: "#13131e",
        borderBottom: "1px solid #1e1e2a",
        padding: "0 24px",
        height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "linear-gradient(135deg, #6c63ff, #9f5cfc)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px"
          }}>₹</div>
          <span style={{ fontSize: "15px", fontWeight: 700, color: "#e8e8f0", letterSpacing: "-0.01em" }}>
            Expense Tracker
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid #2a2a38",
            color: "#8888aa",
            borderRadius: "8px",
            padding: "7px 14px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => { e.target.style.borderColor = "#ff4757"; e.target.style.color = "#ff6b78"; }}
          onMouseLeave={e => { e.target.style.borderColor = "#2a2a38"; e.target.style.color = "#8888aa"; }}
        >
          Sign out
        </button>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Summary Cards */}
        {!summary ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
            {[1,2,3].map(i => (
              <div key={i} className="card skeleton" style={{ height: "110px" }} />
            ))}
          </div>
        ) : (
          <div className="animate-slide-up" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginBottom: "28px"
          }}>
            <SummaryCard
              label="Total Income"
              amount={summary.income}
              color="#34d399"
              icon="↑"
            />
            <SummaryCard
              label="Total Expense"
              amount={summary.expense}
              color="#f87171"
              icon="↓"
            />
            <SummaryCard
              label="Net Balance"
              amount={summary.balance}
              color={balancePositive ? "#6c63ff" : "#f87171"}
              icon={balancePositive ? "✦" : "⚠"}
              sub={balancePositive ? "You're doing great!" : "Spending more than earning"}
            />
          </div>
        )}
        {/* Main layout */}
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "20px", alignItems: "start" }}>
          {/* Left: Form */}
          <div className="animate-slide-up" style={{ animationDelay: "0.05s", animationFillMode: "both" }}>
            <TransactionForm onSuccess={refreshAll} />
          </div>

          {/* Right: List with filter */}
          <div className="animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="inp"
                style={{
                marginBottom: "14px"
                }}
            />

            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="inp"
                style={{
                marginBottom: "14px",
                cursor: "pointer"
                }}
            >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
            </select>

            <select
  value={dateFilter}
  onChange={(e) => setDateFilter(e.target.value)}
  className="inp"
  style={{
    marginBottom: "14px",
    cursor: "pointer"
  }}
>
  <option value="all">All Time</option>
  <option value="7days">Last 7 Days</option>
  <option value="30days">Last 30 Days</option>
  <option value="month">This Month</option>
</select>
            
            {/* Filter tabs */}
            <div style={{
              display: "flex", gap: "6px",
              background: "#13131e",
              border: "1px solid #1e1e2a",
              borderRadius: "12px",
              padding: "5px",
              marginBottom: "16px",
              width: "fit-content"
            }}>
              {[
                { value: "all", label: "All" },
                { value: "income", label: "↑ Income" },
                { value: "expense", label: "↓ Expense" }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: "Inter, sans-serif",
                    transition: "all 0.2s",
                    background: filter === value
                      ? (value === "income" ? "rgba(52,211,153,0.12)"
                        : value === "expense" ? "rgba(248,113,113,0.12)"
                        : "rgba(108,99,255,0.12)")
                      : "transparent",
                    color: filter === value
                      ? (value === "income" ? "#34d399"
                        : value === "expense" ? "#f87171"
                        : "#6c63ff")
                      : "#4a4a65"
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div
  style={{
    position: "relative",
    marginBottom: "14px"
  }}
>

  <button
    className="btn"
    onClick={() =>
      setShowDownloadMenu(
        !showDownloadMenu
      )
    }
  >
    Download ▼
  </button>

  {showDownloadMenu && (

    <div
      style={{
        position: "absolute",
        top: "110%",
        right: 0,
        background: "#13131e",
        border: "1px solid #23233a",
        borderRadius: "12px",
        overflow: "hidden",
        zIndex: 100,
        minWidth: "180px"
      }}
    >

      <button
        className="download-item"
        onClick={handleExportCSV}
      >
        Export CSV
      </button>

      <button
  className="download-item"
  onClick={handleExportExcel}
>
  Export Excel
</button>

      <button
  className="download-item"
  onClick={handleExportPDF}
>
  Export PDF
</button>

      <button
  className="download-item"
  onClick={handleExportDOCX}
>
  Export DOCX
</button>

    </div>

  )}

</div>

             <TransactionList
  refreshKey={refreshKey}
  onDelete={handleDelete}
  filter={filter}
  search={search}
  sortBy={sortBy}
  dateFilter={dateFilter}
/>
          </div>
        </div>

      </div>

        {/* Analytics Chart */}
        <div
          className="animate-slide-up"
          style={{
          marginBottom: "28px"
        }}
        >
          <ExpenseChart summary={summary} />
          <div
  className="animate-slide-up"
  style={{
    marginBottom: "28px"
  }}
>
  <TrendChart transactions={transactions} />
</div>
        </div>
        <CategoryChart transactions={transactions} />

        

      {/* Footer */}
      <div style={{
        textAlign: "center", padding: "24px",
        color: "#2a2a3a", fontSize: "12px",
        borderTop: "1px solid #1a1a24",
        marginTop: "40px"
      }}>
        Expense Tracker · Built with ♥
      </div>
    </div>
  );
}

export default Dashboard;
