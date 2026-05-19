import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f0f13 0%, #13131e 60%, #0f0f13 100%)",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute", top: "-200px", left: "-200px",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: "-200px", right: "-200px",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(159,92,252,0.06) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div className="animate-slide-up" style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo area */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "16px",
            background: "linear-gradient(135deg, #6c63ff, #9f5cfc)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 32px rgba(108,99,255,0.3)"
          }}>
            <span style={{ fontSize: "24px" }}>₹</span>
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#e8e8f0", letterSpacing: "-0.02em" }}>
            Expense Tracker
          </h1>
          <p style={{ color: "#5a5a7a", fontSize: "13px", marginTop: "4px" }}>
            Track every rupee, every day
          </p>
        </div>

        <div className="card" style={{ padding: "32px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px", color: "#e8e8f0" }}>
            Welcome back
          </h2>
          <p style={{ color: "#5a5a7a", fontSize: "13px", marginBottom: "28px" }}>
            Sign in to your account
          </p>

          {error && (
            <div style={{
              background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: "10px", padding: "12px 14px", marginBottom: "20px",
              color: "#f87171", fontSize: "13px"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "#8888aa", marginBottom: "6px", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Email
              </label>
              <input
                className="inp"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "#8888aa", marginBottom: "6px", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Password
              </label>
              <input
                className="inp"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%", marginTop: "8px", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "#5a5a7a" }}>
            New here?{" "}
            <Link to="/register" style={{ color: "#6c63ff", fontWeight: 600, textDecoration: "none" }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
