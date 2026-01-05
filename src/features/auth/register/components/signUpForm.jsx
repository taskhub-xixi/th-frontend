"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Briefcase, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/features/auth/register/form/register";
import apiClient from "@/lib/axios";
import { cn } from "@/lib/utils";
import { handleApiError } from "@/lib/errorHandler";

export function SignupForm({ className, ...props }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // resolver zodResolver
  const { formState, register, handleSubmit, watch, control } = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      repeatPassword: "",
      role: "",
    },
    resolver: zodResolver(formSchema),
  });

  const selectedRole = watch("role");

  const signupUser = async (formData) => {
    setIsLoading(true);
    try {
      const _response = await apiClient.post("/api/auth/register", formData);
      toast.success("Berhasil daftar");
      router.push("/login");
    } catch (error) {
      const errorInfo = handleApiError(error, "Gagal mendaftar. Silakan coba lagi.");
      toast.error(errorInfo.toastMessage);
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
          <form onSubmit={handleSubmit(signupUser)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input type="text" {...register("name")} />
                <CardDescription className="text-red-500">
                  {formState.errors.name?.message}
                </CardDescription>
              </Field>
              <Field>
                <FieldLabel>I want to:</FieldLabel>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <label
                    className={cn(
                      "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all",
                      selectedRole === "poster"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <input
                      id="role-poster"
                      type="radio"
                      value="poster"
                      {...register("role")}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <Briefcase className={cn("h-5 w-5", selectedRole === "poster" ? "text-blue-600" : "text-gray-400")} />
                    <div>
                      <p className={cn("font-medium", selectedRole === "poster" ? "text-blue-900" : "text-gray-900")}>Post Jobs</p>
                      <p className="text-sm text-gray-500">I need to hire taskers</p>
                    </div>
                  </label>
                  <label
                    className={cn(
                      "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all",
                      selectedRole === "tasker"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <input
                      id="role-tasker"
                      type="radio"
                      value="tasker"
                      {...register("role")}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <User className={cn("h-5 w-5", selectedRole === "tasker" ? "text-blue-600" : "text-gray-400")} />
                    <div>
                      <p className={cn("font-medium", selectedRole === "tasker" ? "text-blue-900" : "text-gray-900")}>Find Work</p>
                      <p className="text-sm text-gray-500">I want to work as a tasker</p>
                    </div>
                  </label>
                </div>
                <CardDescription className="text-red-500">
                  {formState.errors.role?.message}
                </CardDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input type="email" {...register("email")} />
                <CardDescription className="text-red-500">
                  {formState.errors.email?.message}
                </CardDescription>
              </Field>
              <Field>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2.5">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input type="password" {...register("password")} />
                    <CardDescription className="text-red-500">
                      {formState.errors.password?.message}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <FieldLabel htmlFor="repeatPassword">Confirm Password</FieldLabel>
                    <Input type="password" {...register("repeatPassword")} />
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
