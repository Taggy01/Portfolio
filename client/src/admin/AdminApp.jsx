import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./AdminLayout";

const API = "http://localhost:5000";

export default function AdminApp() {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.admin) {
          setAdmin(data.admin);
        }
      } catch {
        // not authenticated
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (adminData) => {
    setAdmin(adminData);
  };

  const handleLogout = () => {
    setAdmin(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/30 font-sans text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminLayout admin={admin} onLogout={handleLogout} />;
}
