// src/features/jobs/schemas/jobSchema.js
import { z } from "zod";

// Helper untuk format deadline ke MySQL DATETIME
const toMySQLDateTime = (date) => {
  if (!date) return null;
  return date.toISOString().slice(0, 19).replace("T", " ");
};

// Main job schema
export const jobSchema = z.object({
  budget: z.coerce
    .number()
    .positive("Budget must be a positive number")
    .max(1000000000, "Budget is too large"),

  // Optional fields
  category_id: z.coerce
    .number()
    .int("Category ID must be an integer")
    .positive("Category ID must be a positive number")
    .nullable()
    .optional(),

  commitment: z
    .enum(["full-time", "part-time", "contract", "freelance", "temporary"])
    .optional()
    .nullable(),

  // ✅ FIX: Deadline dengan transform ke MySQL format
  deadline: z.coerce.date().nullable().optional().transform(toMySQLDateTime),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .trim(),

  experience_level: z
    .enum(["entry", "intermediate", "experienced", "expert"])
    .optional()
    .nullable(),

  location: z
    .string()
    .max(255, "Location must not exceed 255 characters")
    .trim()
    .nullable()
    .optional(),

  payment_type: z.enum(["fixed", "hourly", "project", "milestone"]).optional().nullable(),

  skills: z.string().max(500, "Skills must not exceed 500 characters").nullable().optional(),

  // Status hanya untuk update
  status: z.enum(["open", "in_progress", "completed", "cancelled"]).optional(),
  // Required fields
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must not exceed 255 characters")
    .trim(),

  work_type: z.enum(["remote", "onsite", "hybrid"]).optional().nullable(),
});

// Schema untuk create (tanpa status)
export const createJobSchema = jobSchema.omit({ status: true });

// Schema untuk update (semua optional)
export const updateJobSchema = jobSchema.partial();
