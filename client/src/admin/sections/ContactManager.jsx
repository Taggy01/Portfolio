import { useState, useEffect } from "react";
import api from "../../api";

export default function ContactManager() {
  const [form, setForm] = useState({
    email: "",
    github: "",
    linkedin: "",
    heading: "",
    subheading: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data } = await api.get("/api/portfolio/contact", {
          withCredentials: true,
        });
        if (data.success && data.data) {
          const d = data.data;
          setForm({
            email: d.email || "",
            github: d.github || "",
            linkedin: d.linkedin || "",
            heading: d.heading || "",
            subheading: d.subheading || "",
            description: d.description || "",
          });
        }
      } catch {
        setStatus({ type: "error", text: "Failed to load contact data" });
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const { data } = await api.post("/api/portfolio/contact", form, {
        withCredentials: true,
      });

      if (data.success) {
        setStatus({ type: "success", text: "Contact info saved successfully!" });
      } else {
        setStatus({ type: "error", text: data.message || "Failed to save" });
      }
    } catch (error) {
      setStatus({
        type: "error",
        text: error.response?.data?.message || "Unable to connect to server",
      });
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
          Contact Section
        </h2>
        <p className="text-white/40 font-sans text-sm">
          Manage your contact information and social links.
        </p>
      </div>

      {status && (
        <div
          className={`px-4 py-3 rounded-lg text-sm mb-6 ${
            status.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {status.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          <h3 className="font-bricolage text-sm font-semibold text-white/60 uppercase tracking-wider">
            Page Content
          </h3>

          <div>
            <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
              Heading
            </label>
            <input
              type="text"
              value={form.heading}
              onChange={(e) => setForm({ ...form, heading: e.target.value })}
              placeholder="Get In Touch"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
              Subheading
            </label>
            <input
              type="text"
              value={form.subheading}
              onChange={(e) => setForm({ ...form, subheading: e.target.value })}
              placeholder="Let's work together"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="A short message about contacting you"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors resize-y"
            />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          <h3 className="font-bricolage text-sm font-semibold text-white/60 uppercase tracking-wider">
            Social Links
          </h3>

          <div>
            <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="hello@example.com"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
              GitHub
            </label>
            <input
              type="url"
              value={form.github}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              value={form.linkedin}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
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
