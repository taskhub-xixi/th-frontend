/**
 * Custom Sign Up Form menggunakan SuperTokens functions
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "supertokens-auth-react/recipe/emailpassword";

export function CustomSignUpForm({ className }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // ✅ SuperTokens signUp function
      const response = await signUp({
        formFields: [
          {
            id: "email",
            value: formData.email,
          },
          {
            id: "password",
            value: formData.password,
          },
          {
            id: "name",
            value: formData.name,
          },
        ],
      });

      // Handle response
      if (response.status === "FIELD_ERROR") {
        // Field validation errors
        const errorMessages = response.formFields
          .map((field) => field.error)
          .filter(Boolean)
          .join(", ");
        setError(errorMessages);
      } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
        setError(response.reason || "Sign up not allowed");
      } else if (response.status === "OK") {
        // ✅ Sign up successful!
        // User automatically logged in!
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {error && (
          <div style={{ color: "red", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
            minLength={8}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>

        <p>
          Already have an account?{" "}
          <a href="/auth">Sign in</a>
        </p>
      </form>
    </div>
  );
}
