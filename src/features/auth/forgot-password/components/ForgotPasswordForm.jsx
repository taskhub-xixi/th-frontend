"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!email || !email.trim()) {
        setError("Email is required");
        return;
      }

      const response = await authApi.forgotPassword(email);

      if (response.success) {
        setSubmitted(true);
        setEmail("");
        toast.success("Email sent!", {
          description: "Check your email for password reset instructions",
        });

        // Show reset link in development mode
        if (response.resetLink) {
          console.log("Reset Link (dev only):", response.resetLink);
        }
      } else {
        setError(response.message || "Failed to process request");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      toast.error("Error", {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>Enter your email to receive a password reset link</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Check your email</h3>
                <p className="text-gray-600 text-sm">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-gray-600 text-sm">
                  The link will expire in 1 hour for security reasons.
                </p>
              </div>
              <Link href="/login">
                <Button className="w-full" variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      autoComplete="email"
                      className="pl-10"
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <FieldDescription>
                    Enter the email address associated with your account
                  </FieldDescription>
                </Field>

                <Field>
                  <Button className="w-full" disabled={isLoading} type="submit">
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <FieldDescription className="text-center">
                    Remember your password?{" "}
                    <Link className="underline" href="/login">
                      Back to Login
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
