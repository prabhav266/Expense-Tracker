const express = require("express");

const cors = require("cors");

require("dotenv").config();

const authRoutes =
  require("./routes/auth.routes");

const transactionRoutes =
  require("./routes/transaction.routes");

const app = express();


app.use(cors());

app.use(express.json());


app.use("/api/auth", authRoutes);

app.use(
  "/api/transactions",
  transactionRoutes
);

app.get("/", (req, res) => {

  res.send("API is running");

});


const PORT =
  process.env.PORT || 3001;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});