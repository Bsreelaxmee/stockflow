"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    organizationName: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) return setError("Passwords do not match");
    setLoading(true);
    
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        organizationName: form.organizationName,
      }),
    });
    
    setLoading(false);
    const data = await res.json();
    if (!res.ok) return setError(data.error ?? "Signup failed");
    
    // Redirect to login page after successful signup
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl bg-white p-8 shadow space-y-4">
        <h1 className="text-xl font-semibold">Create your account</h1>
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        
        <input
          type="text"
          className="w-full rounded border p-2"
          placeholder="Organization name (e.g., My Store)"
          value={form.organizationName}
          onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
          required
        />
        <input
          type="email"
          className="w-full rounded border p-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          className="w-full rounded border p-2"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <input
          type="password"
          className="w-full rounded border p-2"
          placeholder="Confirm password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          required
        />
        
        <button
          disabled={loading}
          className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
        
        <p className="text-sm text-center text-gray-600">
          Have an account?{" "}
          <Link href="/login" className="underline text-black font-medium">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
