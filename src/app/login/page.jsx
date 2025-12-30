"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

export default function Login() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      // Get user from storage
      const userKey = `user:${formData.email}`;

      const result = localStorage.getItem(userKey);
      if (!result) {
        toast.error("Invalid email or password");
        return;
      }

      const user = JSON.parse(result);

      // Check password
      if (user.password !== formData.password) {
        toast.error("Invalid email or password");
        setLoading(false);
        return;
      }

      // Login successful
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;

      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);

      toast.success(`Welcome back, ${user.firstName}!`);
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-6 px-4"
      >
        <h1 className="font-poppins font-semibold text-3xl md:text-4xl text-center">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-foreground"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-foreground"
          required
        />

        <div>
          <Link
            href="/"
            className="hover:underline hover:underline-offset-4 text-sm"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-30 px-4 py-3 rounded bg-primary text-secondary hover:bg-primary/80 hover:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>

        <div>
          <Link href="/register">
            <p className="text-sm text-center">
              Dont have an account?{" "}
              <span className="font-semibold hover:underline hover:underline-offset-4">
                Sign Up
              </span>
            </p>
          </Link>
        </div>
      </form>
    </div>
  );
}
