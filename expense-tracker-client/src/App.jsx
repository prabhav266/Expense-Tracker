import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyOTP from "./pages/VerifyOTP";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
  path="/verify-otp"
  element={<VerifyOTP />}
/>
      
      <Route 
      path="/dashboard" 
      element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
      } 
      />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default App;