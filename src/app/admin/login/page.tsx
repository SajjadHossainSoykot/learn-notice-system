"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setMessage("Invalid email/password or inactive admin account.");
        return;
      }

      router.push("/admin/notices");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong during login.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true);
      setMessage("");

      await signIn("google", {
        callbackUrl: "/admin/notices",
      });
    } catch (error) {
      console.error("Google login error:", error);
      setMessage("Google login failed.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-10 text-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
            Notice System Admin
          </p>

          <h1 className="text-3xl font-bold">Admin Login</h1>

          <p className="mt-2 text-gray-600">
            Login with site password or approved Google admin account.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="mb-5 w-full rounded-lg border px-5 py-3 font-medium text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? "Opening Google..." : "Continue with Google"}
          </button>

          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Site Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
                placeholder="Enter site password"
                required
              />
            </div>

            {message && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login with Site Password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}