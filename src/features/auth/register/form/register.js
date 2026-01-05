import { z } from "zod";

export const formSchema = z
  .object({
    email: z.email("Email tidak valid"),
    name: z.string().min(3, "Nama minimal 3 karakter"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    repeatPassword: z.string(),
    role: z.enum(["poster", "tasker"], {
      required_error: "Silakan pilih peran Anda",
    }),
  })
  .superRefine((arg, ctx) => {
    if (arg.password !== arg.repeatPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Password tidak sama",
        path: ["repeatPassword"],
      });
    }
  });
