require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mainRoutes = require("./routes");
const authRoutes = require("./routes/auth.routes");
const transactionRoutes = require("./routes/transaction.routes");

const app = express();

// BUG FIX: configure CORS with proper origin and credentials support
app.use(cors({

  origin: [

    "http://localhost:5173",

    "https://expense-tracker-three-kappa-62.vercel.app"

  ],

  credentials: true

}));
app.use(express.json());
app.use("/", mainRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
