import { useState, useEffect } from "react";
import api from "../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    achievements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, skillsRes, achievementsRes] = await Promise.all([
          api.get("/api/portfolio/projects", { withCredentials: true }),
          api.get("/api/portfolio/skills", { withCredentials: true }),
          api.get("/api/portfolio/achievements", { withCredentials: true }),
        ]);

        const projects = projectsRes.data;
        const skills = skillsRes.data;
        const achievements = achievementsRes.data;

        setStats({
          projects: projects.data?.length || 0,
          skills: skills.data?.length || 0,
          achievements: achievements.data?.length || 0,
        });
      } catch {
        // Stats will remain at 0
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    { label: "Projects", count: stats.projects, icon: "🚀", color: "border-blue-500/30" },
    { label: "Skill Categories", count: stats.skills, icon: "⚡", color: "border-yellow-500/30" },
    { label: "Achievements", count: stats.achievements, icon: "🏆", color: "border-green-500/30" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bricolage font-bold">Welcome back 👋</h2>
      <p className="mt-2 text-gray-500">
        Here&apos;s an overview of your portfolio content.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl border border-white/10 ${card.color}
              bg-white/[0.02] p-6 hover:border-white/20 transition`}
          >
            <div className="text-2xl">{card.icon}</div>
            <p className="mt-4 text-3xl font-bricolage font-bold">
              {loading ? "—" : card.count}
            </p>
            <p className="mt-1 text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div
        className="mt-10 rounded-2xl border border-white/10
          bg-white/[0.02] p-6"
      >
        <h3 className="text-lg font-bricolage font-semibold">Quick Tips</h3>
        <ul className="mt-4 space-y-3 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-gray-600">•</span>
            Use the sidebar to manage each section of your portfolio.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-600">•</span>
            Changes made here will be reflected on the public portfolio via API.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-600">•</span>
            Click &quot;View Site&quot; in the sidebar to preview your portfolio.
          </li>
        </ul>
      </div>
    </div>
  );
}

