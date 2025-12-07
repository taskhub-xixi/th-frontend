"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/features/auth/register/form/register";
import apiClient from "@/lib/axios";
import { cn } from "@/lib/utils";

export function SignupForm({ className, ...props }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { formState, register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      repeatPassword: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formData) => {
    setIsLoading(true);

    try {
      await apiClient.post("/auth/register", {
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      toast.success("Berhasil daftar! Silakan login.");
      router.push("/login");
    } catch (error) {
      // Fixed error message extraction
      const status = error.response?.status;
      const message = error.response?.data?.message || "Terjadi kesalahan saat registrasi";

      if (status === 400) {
        toast.error(`Error: ${message}`);
      } else if (status === 409) {
        toast.error("Email sudah terdaftar");
      } else if (status >= 500) {
        toast.error("Server error, coba lagi nanti");
      } else if (!error.response) {
        toast.error("Tidak dapat terhubung ke server");
      } else {
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
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register("name")}
                />
                <CardDescription className="text-red-500">
                  {formState.errors.name?.message}
                </CardDescription>
              </Field>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2.5">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      {...register("password")}
                    />
                    <CardDescription className="text-red-500">
                      {formState.errors.password?.message}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <FieldLabel htmlFor="repeatPassword">Confirm Password</FieldLabel>
                    <Input
                      id="repeatPassword"
                      type="password"
                      autoComplete="new-password"
                      {...register("repeatPassword")}
                    />
                    <CardDescription className="text-red-500">
                      {formState.errors.repeatPassword?.message}
                    </CardDescription>
                  </div>
                </div>
              </Field>
              <Field>
                <Button className="w-full" disabled={isLoading} type="submit">
                  {isLoading ? "Loading..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link className="underline" href="/login">
                    Sign in
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
