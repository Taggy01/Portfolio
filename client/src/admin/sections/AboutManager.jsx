import { useState, useEffect } from "react";

const API = "http://localhost:5000";

function StatusMessage({ message }) {
  if (!message) return null;
  return (
    <div
      className={`px-4 py-3 rounded-lg text-sm mb-6 ${message.type === "success"
          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
          : "bg-red-500/10 border border-red-500/20 text-red-400"
        }`}
    >
      {message.text}
    </div>
  );
}

export default function AboutManager() {
  const [form, setForm] = useState({
    heroName: "",
    heroRole: "",
    title: "",
    description: "",
    education: "",
    experience: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${API}/api/portfolio/about`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.data) {
          const d = data.data;
          setForm({
            heroName: d.heroName || "",
            heroRole: d.heroRole || "",
            title: d.title || "",
            description: Array.isArray(d.description)
              ? d.description.join("\n\n")
              : d.description || "",
            education: typeof d.education === "object"
              ? JSON.stringify(d.education, null, 2)
              : d.education || "",
            experience: typeof d.experience === "object"
              ? JSON.stringify(d.experience, null, 2)
              : d.experience || "",
          });
        }
      } catch {
        setStatus({ type: "error", text: "Failed to load about data" });
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      // Parse description into paragraphs
      const descriptionParagraphs = form.description
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

      // Try to parse education and experience as JSON, fall back to string
      let education = form.education;
      let experience = form.experience;
      try {
        education = JSON.parse(form.education);
      } catch {
        // keep as string
      }
      try {
        experience = JSON.parse(form.experience);
      } catch {
        // keep as string
      }

      const res = await fetch(`${API}/api/portfolio/about`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          heroName: form.heroName,
          heroRole: form.heroRole,
          title: form.title,
          description: descriptionParagraphs,
          education,
          experience,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ type: "success", text: "About section saved successfully!" });
      } else {
        setStatus({ type: "error", text: data.message || "Failed to save" });
      }
    } catch {
      setStatus({ type: "error", text: "Unable to connect to server" });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="font-bricolage text-xl font-bold text-white mb-1">
          About Section
        </h2>
        <p className="text-white/40 font-sans text-sm">
          Manage your introduction and personal details.
        </p>
      </div>

      <StatusMessage message={status} />

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
            Hero Name
          </label>
          <input
            type="text"
            value={form.heroName}
            onChange={(e) => setForm({ ...form, heroName: e.target.value })}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <div>
          <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
            Hero Role
          </label>
          <input
            type="text"
            value={form.heroRole}
            onChange={(e) => setForm({ ...form, heroRole: e.target.value })}
            placeholder="Full Stack Developer"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <div>
          <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="About Me"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <div>
          <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
            Description
            <span className="text-white/20 normal-case tracking-normal ml-2">
              (separate paragraphs with blank lines)
            </span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={8}
            placeholder="Write about yourself..."
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors resize-y"
          />
        </div>


        <div>
          <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
            Education
            <span className="text-white/20 normal-case tracking-normal ml-2">
              (JSON format)
            </span>
          </label>

          <textarea
            value={form.education}
            onChange={(e) =>
              setForm({ ...form, education: e.target.value })
            }
            rows={7}
            placeholder={`{
  "title": "B.Tech in Computer Science & Engineering",
  "institution": "Bengal College of Engineering and Technology, Durgapur",
  "duration": "2023 - 2027",
  "cgpa": "7.4/10"
}`}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-white/30 transition-colors resize-y"
          />
        </div>


        <div>
          <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
            Experience
            <span className="text-white/20 normal-case tracking-normal ml-2">
              (JSON format)
            </span>
          </label>
          <textarea
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            rows={6}
            placeholder='{"title": "Developer", "company": "...", "duration": "..."}'
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-white/30 transition-colors resize-y"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-lg bg-white text-black font-sans font-semibold text-sm hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
