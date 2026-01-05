"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { formSchemaLogin } from "@/features/auth/login/form/login";
import { handleApiError, showErrorToast } from "@/lib/errorHandler";
import { cn } from "@/lib/utils";

export function LoginForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const { login } = useAuth();

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchemaLogin),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError("");

    try {
      await login(data);
    } catch (error) {
      const errorInfo = showErrorToast(error, "Login gagal");
      setAuthError(errorInfo.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login dengan email dan password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {authError && (
              <Alert className="mb-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input autoComplete="email" id="email" type="email" {...register("email")} />
                <CardDescription className="text-red-500">
                  {formState.errors.email?.message}
                </CardDescription>
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link className="ml-auto text-sm underline-offset-4 hover:underline" href="/forgot-password">
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  autoComplete="current-password"
                  id="password"
                  type="password"
                  {...register("password")}
                />
                <CardDescription className="text-red-500">
                  {formState.errors.password?.message}
                </CardDescription>
              </Field>
              <Field>
                <Button className="w-full" disabled={isLoading} type="submit">
                  {isLoading ? "Loading..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Belum punya akun?{" "}
                  <Link className="underline" href="/register">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
