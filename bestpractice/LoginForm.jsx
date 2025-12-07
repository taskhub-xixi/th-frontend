"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import apiClient from "@/lib/axios";
import { cn } from "@/lib/utils";

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const { setUser } = useAuth();

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
      // Call login API
      const response = await apiClient.post("/auth/login", data);

      // Extract token and user from response
      // Adjust structure sesuai dengan response dari backend kamu
      const { token, user } = response.data;

      if (token) {
        // Save token to localStorage
        localStorage.setItem("auth_token", token);
      }

      if (user) {
        // Update AuthContext state
        setUser(user);
        // Save user to localStorage for persistence
        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success("Login berhasil");

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      // Better error handling
      const status = error.response?.status;
      const message = error.response?.data?.message || "Terjadi kesalahan saat login";

      if (status === 401) {
        setAuthError("Email atau password salah");
        toast.error("Email atau password salah");
      } else if (status === 400) {
        setAuthError(message);
        toast.error(message);
      } else if (status >= 500) {
        setAuthError("Server error, coba lagi nanti");
        toast.error("Server error");
      } else if (!error.response) {
        // Network error
        setAuthError("Tidak dapat terhubung ke server");
        toast.error("Periksa koneksi internet Anda");
      } else {
        setAuthError(message);
        toast.error(message);
      }
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
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                />
                <CardDescription className="text-red-500">
                  {formState.errors.email?.message}
                </CardDescription>
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a className="ml-auto text-sm underline-offset-4 hover:underline" href="#">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
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
