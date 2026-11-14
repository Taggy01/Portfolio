import { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import AboutManager from "./sections/AboutManager";
import ProjectsManager from "./sections/ProjectsManager";
import SkillsManager from "./sections/SkillsManager";
import AchievementsManager from "./sections/AchievementsManager";
import ContactManager from "./sections/ContactManager";
import api from "../api";

const sections = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "about", label: "About", icon: "👤" },
  { key: "projects", label: "Projects", icon: "🚀" },
  { key: "skills", label: "Skills", icon: "⚡" },
  { key: "achievements", label: "Achievements", icon: "🏆" },
  { key: "contact", label: "Contact", icon: "📬" },
];

export default function AdminLayout({ admin, onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout", {}, {
        withCredentials: true,
      });
    } catch {
      // Logout even if request fails
    }
    onLogout();
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "about":
        return <AboutManager />;
      case "projects":
        return <ProjectsManager />;
      case "skills":
        return <SkillsManager />;
      case "achievements":
        return <AchievementsManager />;
      case "contact":
        return <ContactManager />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50
          w-64 border-r border-white/10 bg-[#0d0d0d]
          flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <h2 className="text-lg font-bricolage font-bold">Admin Panel</h2>
          <p className="text-xs text-gray-500 mt-1">{admin.email}</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => {
                setActiveSection(section.key);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5
                rounded-lg text-sm transition-all
                ${
                  activeSection === section.key
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <span className="text-base">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/10 space-y-2">
          <a
            href="/home"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg
              text-sm text-gray-400 hover:bg-white/5 hover:text-white transition"
          >
            <span className="text-base">🌐</span>
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5
              rounded-lg text-sm text-red-400
              hover:bg-red-500/10 transition"
          >
            <span className="text-base">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 border-b border-white/10
            bg-[#090909]/80 backdrop-blur-xl px-6 py-4
            flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-bricolage font-semibold capitalize">
              {activeSection}
            </h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

