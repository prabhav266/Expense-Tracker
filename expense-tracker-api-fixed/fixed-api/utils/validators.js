const { z } = require("zod");

exports.transactionSchema = z.object({
    amount: z.number().positive(),
    type: z.enum(["income","expense"]),
    category: z.string().optional(),
    note: z.string().optional()
});