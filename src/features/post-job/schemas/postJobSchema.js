import { z } from "zod";

export const postJobFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must not exceed 255 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters"),

  budget: z
    .string()
    .min(1, "Budget is required")
    .refine((val) => !isNaN(Number(val)), "Budget must be a number")
    .refine((val) => Number(val) > 0, "Budget must be greater than 0"),

  location: z
    .string()
    .max(255, "Location must not exceed 255 characters")
    .optional()
    .or(z.literal("")),

  work_type: z.enum(["remote", "onsite", "hybrid"], {
    required_error: "Please select a work type",
  }),

  commitment: z.enum(["full-time", "part-time", "contract", "freelance", "temporary"], {
    required_error: "Please select a commitment level",
  }),

  category: z.string().optional().or(z.literal("0")).or(z.literal("")),

  experience_level: z.enum(["entry", "intermediate", "experienced", "expert"], {
    required_error: "Please select experience level",
  }),

  payment_type: z.enum(["fixed", "hourly", "project", "milestone"], {
    required_error: "Please select a payment type",
  }),

  skills: z.string().max(500, "Skills must not exceed 500 characters").optional().or(z.literal("")),

  deadline: z.string().optional().or(z.literal("")),

  additional_info: z
    .string()
    .max(1000, "Additional info must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});
