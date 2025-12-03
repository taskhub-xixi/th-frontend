import { z, ZodEmail, ZodString } from "zod";

export const formSchemaLogin = z.object({
  email: z.email({
    message: "Invalid email address",
  }),
  password: z
    .string()
    .min(8, { message: "Password  must be atleast 8 characters long" }),
});
