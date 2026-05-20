import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

function VerifyOTP() {

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleVerify = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      await api.post(
        "/auth/verify-otp",
        {
          email,
          otp
        }
      );

      alert(
        "Email verified successfully"
      );

      navigate("/login");

    } catch (err) {

      setError(
        err.response?.data?.message
        ||
        "Verification failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="auth-container">

      <form
        onSubmit={handleVerify}
        className="card"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px"
        }}
      >

        <h2
          style={{
            marginBottom: "10px"
          }}
        >
          Verify OTP
        </h2>

        <p
          style={{
            color: "#888",
            marginBottom: "24px",
            fontSize: "14px"
          }}
        >
          Enter the OTP sent to:
          <br />
          <strong>{email}</strong>
        </p>

        {error && (

          <div
            style={{
              color: "#ff6b6b",
              marginBottom: "16px"
            }}
          >
            {error}
          </div>

        )}

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value)
          }
          className="inp"
          required
        />

        <button
          type="submit"
          className="btn"
          disabled={loading}
          style={{
            marginTop: "18px",
            width: "100%"
          }}
        >
          {
            loading
              ? "Verifying..."
              : "Verify OTP"
          }
        </button>

      </form>

    </div>
  );
}

export default VerifyOTP;