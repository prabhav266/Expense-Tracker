const prisma = require("../lib/prisma");

exports.createTransaction = async (data, userId) => {
  return prisma.transaction.create({
    data: { ...data, userId }
  });
};

// BUG FIX: added optional `type` param so filter actually works
exports.getTransactions = async (userId, page, limit, type) => {
  const where = { userId };
  if (type === "income" || type === "expense") {
    where.type = type;
  }
  return prisma.transaction.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" }
  });
};

exports.getTransactionById = async (id) => {
  return prisma.transaction.findUnique({ where: { id } });
};

exports.updateTransaction = async (id, data) => {
  return prisma.transaction.update({ where: { id }, data });
};

exports.deleteTransaction = async (id) => {
  return prisma.transaction.delete({ where: { id } });
};

exports.getSummary = async (userId) => {
  const transactions = await prisma.transaction.findMany({ where: { userId } });
  const summary = transactions.reduce(
    (acc, t) => {
      if (t.type === "income") acc.income += t.amount;
      else acc.expense += t.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );
  summary.balance = summary.income - summary.expense;
  return summary;
};
