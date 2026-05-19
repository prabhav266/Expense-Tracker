const transactionService = require("../services/transaction.service");
const { transactionSchema } = require("../utils/validators");

exports.createTransaction = async (req, res) => {
  try {
    const parsed = transactionSchema.parse(req.body);
    const transaction = await transactionService.createTransaction(parsed, req.user.id);
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    // BUG FIX: was using undefined `prisma` directly; now uses service layer
    // BUG FIX: only pass type filter if it's a valid value (not "all")
    const validType = (type === "income" || type === "expense") ? type : undefined;
    const transactions = await transactionService.getTransactions(
      req.user.id,
      Number(page),
      Number(limit),
      validType
    );
    res.json(transactions);
  } catch (error) {
    console.error("TRANSACTION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid transaction ID" });

    const parsed = transactionSchema.parse(req.body);
    const existing = await transactionService.getTransactionById(id);

    if (!existing) return res.status(404).json({ message: "Not found" });
    if (existing.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    const updated = await transactionService.updateTransaction(id, parsed);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid transaction ID" });

    const existing = await transactionService.getTransactionById(id);
    if (!existing) return res.status(404).json({ message: "Transaction not found" });
    if (existing.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await transactionService.deleteTransaction(id);
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const summary = await transactionService.getSummary(req.user.id);
    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
