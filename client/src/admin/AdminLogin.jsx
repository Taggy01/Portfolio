import { useState } from "react";
import api from "../api";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/login", { email, password }, {
        withCredentials: true,
      });

      if (!data.success) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      onLogin(data.admin);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Network error. Make sure the server is running."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] flex items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-2xl border border-white/10
        bg-white/[0.02] p-8 sm:p-10"
      >
        <h1 className="text-3xl font-bricolage font-bold text-white text-center">
          Admin Login
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          Sign in to manage your portfolio
        </p>

        {error && (
          <div
            className="mt-6 rounded-lg border border-red-500/30
            bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10
                bg-white/[0.05] px-4 py-3 text-white text-sm
                placeholder-gray-600 outline-none
                focus:border-white/30 transition"
              placeholder="admin@portfolio.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10
                bg-white/[0.05] px-4 py-3 text-white text-sm
                placeholder-gray-600 outline-none
                focus:border-white/30 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-4 py-3
              text-sm font-semibold text-black
              hover:bg-gray-200 transition
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-600">
          <a
            href="#home"
            className="hover:text-gray-400 transition"
          >
            ← Back to portfolio
          </a>
        </p>
      </div>
    </div>
  );
}

