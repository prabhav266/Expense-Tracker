const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const transactionSchema = z.object({
  amount: z.number(),

  currency: z.enum([
    "INR",
    "USD",
    "EUR",
    "GBP"
  ]),

  type: z.enum(["income", "expense"]),

  category: z.string(),

  note: z.string().optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  transactionSchema
};