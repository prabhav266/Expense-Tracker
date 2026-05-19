import { useState } from "react";
import api from "../api/axios";

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Business", "Gift", "Other"],
  expense: ["Food", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Rent", "Other"]
};

function TransactionForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currency, setCurrency] = useState("INR");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/transactions", {
        amount: Number(amount),
        currency,
        type,
        category,
        note
    });
      setAmount("");
      setCategory("");
      setNote("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add transaction.");
    } finally {
      setLoading(false);
    }
  };

  const isIncome = type === "income";

  return (
    <div className="card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: isIncome ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", transition: "all 0.2s"
        }}>
          {isIncome ? "💰" : "💸"}
        </div>
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#e8e8f0" }}>Add Transaction</h3>
          <p style={{ fontSize: "12px", color: "#5a5a7a" }}>Record income or expense</p>
        </div>
      </div>

      {/* Type toggle */}
      <div style={{
        display: "flex", background: "#0f0f13", borderRadius: "10px",
        padding: "4px", marginBottom: "20px",
        border: "1px solid #23232f"
      }}>
        {["expense", "income"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setType(t); setCategory(""); }}
            style={{
              flex: 1,
              padding: "9px",
              borderRadius: "7px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s",
              background: type === t
                ? (t === "income" ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)")
                : "transparent",
              color: type === t
                ? (t === "income" ? "#34d399" : "#f87171")
                : "#5a5a7a",
              boxShadow: type === t ? "0 1px 4px rgba(0,0,0,0.3)" : "none"
            }}
          >
            {t === "income" ? "↑ Income" : "↓ Expense"}
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: "8px", padding: "10px 12px", marginBottom: "16px",
          color: "#f87171", fontSize: "13px"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Amount */}
<div>
  <label
    style={{
      fontSize: "11px",
      fontWeight: 600,
      color: "#5a5a7a",
      marginBottom: "6px",
      display: "block",
      textTransform: "uppercase",
      letterSpacing: "0.06em"
    }}
  >
    Amount
  </label>

  <div style={{ display: "flex", gap: "10px" }}>

    {/* Currency */}
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      className="inp"
      style={{
        width: "110px",
        cursor: "pointer",
        flexShrink: 0
      }}
    >
      <option value="INR">INR</option>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="GBP">GBP</option>
    </select>

    {/* Amount Input */}
    <div style={{ position: "relative", flex: 1 }}>
      <span
        style={{
          position: "absolute",
          left: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#5a5a7a",
          fontSize: "15px",
          fontWeight: 600
        }}
      >
        {currency === "INR"
          ? "₹"
          : currency === "USD"
          ? "$"
          : currency === "EUR"
          ? "€"
          : "£"}
      </span>

      <input
        className="inp"
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0"
        step="any"
        style={{
          paddingLeft: "32px",
          fontSize: "16px",
          fontWeight: 600,
          width: "100%"
        }}
      />
    </div>

  </div>
</div>

        {/* Category */}
        <div>
          <label style={{ fontSize: "11px", fontWeight: 600, color: "#5a5a7a", marginBottom: "6px", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Category
          </label>
          <select
            className="inp"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ cursor: "pointer" }}
          >
            <option value="">Select category...</option>
            {CATEGORIES[type].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Note */}
        <div>
          <label style={{ fontSize: "11px", fontWeight: 600, color: "#5a5a7a", marginBottom: "6px", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Note <span style={{ color: "#3a3a50", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
          </label>
          <input
            className="inp"
            type="text"
            placeholder="Add a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: "10px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            transition: "all 0.2s",
            background: success
              ? "linear-gradient(135deg, #34d399, #10b981)"
              : isIncome
                ? "linear-gradient(135deg, #34d399, #059669)"
                : "linear-gradient(135deg, #f87171, #ef4444)",
            color: "#fff",
            opacity: loading ? 0.7 : 1,
            boxShadow: success
              ? "0 4px 16px rgba(52,211,153,0.3)"
              : isIncome
                ? "0 4px 16px rgba(52,211,153,0.25)"
                : "0 4px 16px rgba(248,113,113,0.25)"
          }}
        >
          {success ? "✓ Added!" : loading ? "Adding..." : `Add ${isIncome ? "Income" : "Expense"}`}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;
