"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

export default function Register() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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

    try {
  const userKey = `user:${formData.email}`;

  const existingUser = localStorage.getItem(userKey);
  if (existingUser) {
    toast.error("Email already registered");
    setLoading(false);
    return;
  }

  const newUser = {
    id: Date.now().toString(),
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(userKey, JSON.stringify(newUser));

  const userWithoutPassword = { ...newUser };
  delete userWithoutPassword.password;

  localStorage.setItem(
    "currentUser",
    JSON.stringify(userWithoutPassword)
  );

  setUser(userWithoutPassword);

  toast.success("Account created successfully!");
  router.push("/login");
} catch (error) {
  console.error("Registration error:", error);
  toast.error("Failed to create account. Please try again.");
} finally {
  setLoading(false);
}

  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-6 px-4"
      >
        <h1 className="font-poppins font-semibold text-3xl md:text-4xl text-center">
          Create Account
        </h1>

        <input
          type="text"
          name="firstName"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
          className="border px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-foreground"
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
          className="border px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-foreground"
          required
        />

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
          placeholder="Password (min. 6 characters)"
          value={formData.password}
          onChange={handleChange}
          className="border px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-foreground"
          required
          minLength={6}
        />

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-30 px-4 py-3 rounded bg-primary text-secondary hover:bg-primary/80 hover:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>

        <div>
          <Link href="/login">
            <p className="text-sm text-center">
              Already have an account?{" "}
              <span className="font-semibold hover:underline hover:underline-offset-4">
                Sign In
              </span>
            </p>
          </Link>
        </div>
      </form>
    </div>
  );
}
