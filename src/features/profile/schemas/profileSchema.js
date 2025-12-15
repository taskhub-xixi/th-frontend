import { z } from "zod";

export const profileSchema = z.object({
  bio: z.string().max(500, "Bio must be less than 500 characters").optional().or(z.literal("")),

  email: z.email("Invalid email address"),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "First name can only contain letters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Last name can only contain letters")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .regex(/^[\d\s\-+()]*$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .optional()
    .or(z.literal("")),
});

export const changePasswordSchema = z.object({
  email: z.email("Invalid email address"),
});
