const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors({

  origin: [

    "http://localhost:5173",

    "https://spendwise-emvvyiqa7-prabhav266s-projects.vercel.app"

  ],

  credentials: true

}));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/transactions", transactionRoutes);