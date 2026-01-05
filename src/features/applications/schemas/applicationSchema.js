import { z } from "zod";

export const applicationSchema = z.object({
  proposal: z
    .string()
    .min(10, "Proposal must be at least 10 characters")
    .max(1000, "Proposal must not exceed 1000 characters"),
  proposed_budget: z.coerce
    .number()
    .positive("Proposed budget must be a positive number")
    .optional()
    .nullable(),
});
