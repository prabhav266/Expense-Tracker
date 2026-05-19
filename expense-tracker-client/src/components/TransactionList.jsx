import { useEffect, useState } from "react";
import api from "../api/axios";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatAmount(amount) {
  return new Intl.NumberFormat("en-IN").format(amount);
}

const CATEGORY_ICONS = {
  Salary: "💼", Freelance: "💻", Investment: "📈", Business: "🏢", Gift: "🎁",
  Food: "🍱", Transport: "🚗", Shopping: "🛍️", Bills: "📄", Health: "💊",
  Entertainment: "🎬", Rent: "🏠", Other: "📌"
};

function TransactionList({ refreshKey, onDelete, filter }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // BUG FIX: don't send type=all — only send type when it's income or expense
      const typeParam = (filter === "income" || filter === "expense") ? `&type=${filter}` : "";
      const res = await api.get(`/transactions?page=1&limit=50${typeParam}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshKey, filter]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#e8e8f0", marginBottom: "20px" }}>Transactions</h3>
        {[1,2,3].map(i => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
            <div className="skeleton" style={{ width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: "14px", width: "60%", marginBottom: "8px" }} />
              <div className="skeleton" style={{ height: "11px", width: "40%" }} />
            </div>
            <div className="skeleton" style={{ height: "20px", width: "70px" }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#e8e8f0" }}>
          Transactions
        </h3>
        <span style={{
          background: "#1e1e2a", border: "1px solid #2a2a38",
          borderRadius: "20px", padding: "3px 10px",
          fontSize: "12px", color: "#5a5a7a", fontWeight: 500
        }}>
          {transactions.length} records
        </span>
      </div>

      {transactions.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          color: "#3a3a50"
        }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>📭</div>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#4a4a65" }}>No transactions yet</p>
          <p style={{ fontSize: "12px", color: "#3a3a50", marginTop: "4px" }}>
            {filter !== "all" ? `No ${filter} transactions found.` : "Add your first transaction above."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {transactions.map((t, idx) => (
            <div
              key={t.id}
              className="animate-fade"
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 12px",
                borderRadius: "12px",
                transition: "background 0.15s",
                cursor: "default",
                animationDelay: `${idx * 0.03}s`,
                animationFillMode: "both"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#1e1e2a"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {/* Icon */}
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0,
                background: t.type === "income" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px"
              }}>
                {CATEGORY_ICONS[t.category] || (t.type === "income" ? "💰" : "💸")}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#d0d0e8" }}>
                    {t.category || (t.type === "income" ? "Income" : "Expense")}
                  </span>
                  <span className={t.type === "income" ? "tag-income" : "tag-expense"}>
                    {t.type}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#4a4a65" }}>
                    {formatDate(t.createdAt)}
                  </span>
                  {t.note && (
                    <>
                      <span style={{ color: "#2a2a38", fontSize: "11px" }}>·</span>
                      <span style={{
                        fontSize: "11px", color: "#4a4a65",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "120px"
                      }}>
                        {t.note}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{
                  fontSize: "15px", fontWeight: 700,
                  color: t.type === "income" ? "#34d399" : "#f87171",
                  letterSpacing: "-0.01em"
                }}>
                  {t.type === "income" ? "+" : "-"}
                  {t.currency} {formatAmount(t.amount)}
                </div>
              </div>

              {/* Delete */}
              <button
                className="btn-danger"
                onClick={() => handleDelete(t.id)}
                disabled={deletingId === t.id}
                style={{ flexShrink: 0, opacity: deletingId === t.id ? 0.5 : 1 }}
              >
                {deletingId === t.id ? "..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionList;
