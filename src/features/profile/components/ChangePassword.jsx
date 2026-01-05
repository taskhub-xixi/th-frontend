"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordSchema } from "../schemas/profileSchema";
import { sendPasswordResetEmail } from "../api/profileApi";
import { toast } from "sonner";
import { handleApiError } from "@/lib/errorHandler";

export default function ChangePassword() {
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsSending(true);
      await sendPasswordResetEmail(data.email);
      toast.success("Password reset email sent! Check your inbox.");
      reset();
    } catch (error) {
      const errorInfo = handleApiError(error, "Failed to send reset email");
      toast.error(errorInfo.toastMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pt-0">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2 className="text-xl font-semibold mb-4">Change password</h2>

          {/* Email Input */}
          <div className="mb-4">
            <Label className="sr-only" htmlFor="reset-email">
              Email
            </Label>
            <Input
              id="reset-email"
              placeholder="Email"
              type="email"
              {...register("email")}
              disabled={isSending}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Send Reset Email Button */}
          <Button
            className="w-full bg-black hover:bg-gray-800 text-white"
            disabled={isSending}
            type="submit"
          >
            {isSending ? "Sending..." : "Send Reset Email"}
          </Button>
        </div>
      </form>
    </div>
  );
}
