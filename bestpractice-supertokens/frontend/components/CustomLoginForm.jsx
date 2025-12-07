/**
 * Custom Login Form menggunakan SuperTokens functions
 *
 * Ini contoh jika kamu mau pakai design sendiri
 * instead of pre-built UI dari SuperTokens
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "supertokens-auth-react/recipe/emailpassword";

export function CustomLoginForm({ className }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // ✅ SuperTokens signIn function
      const response = await signIn({
        formFields: [
          {
            id: "email",
            value: email,
          },
          {
            id: "password",
            value: password,
          },
        ],
      });

      // Handle response
      if (response.status === "FIELD_ERROR") {
        // Field validation errors
        response.formFields.forEach((field) => {
          if (field.id === "email") {
            setError(field.error);
          } else if (field.id === "password") {
            setError(field.error);
          }
        });
      } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
        setError("Invalid email or password");
      } else if (response.status === "SIGN_IN_NOT_ALLOWED") {
        // User not allowed to sign in (e.g., email not verified)
        setError(response.reason || "Sign in not allowed");
      } else if (response.status === "OK") {
        // ✅ Login successful!
        // Session created automatically!
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <h2>Login to TaskHub</h2>

        {error && (
          <div style={{ color: "red", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account?{" "}
          <a href="/auth?show=signup">Sign up</a>
        </p>
      </form>
    </div>
  );
}
