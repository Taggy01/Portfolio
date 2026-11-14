import { useState, useEffect } from "react";

const API = "http://localhost:5000";

const EMPTY_SKILL = { category: "", items: "" };

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...EMPTY_SKILL });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const flash = (type, text) => {
    setStatus({ type, text });
    setTimeout(() => setStatus(null), 3500);
  };

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${API}/api/portfolio/skills`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setSkills(data.data);
        }
      } catch {
        flash("error", "Failed to load skills");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [reloadKey]);

  const openAdd = () => {
    setEditId(null);
    setForm({ ...EMPTY_SKILL });
    setShowForm(true);
  };

  const openEdit = (skill) => {
    setEditId(skill._id);
    setForm({
      category: skill.category || "",
      items: Array.isArray(skill.items)
        ? skill.items.join(", ")
        : skill.items || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ ...EMPTY_SKILL });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      category: form.category,
      items: form.items
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = editId
        ? `${API}/api/portfolio/skills/${editId}`
        : `${API}/api/portfolio/skills`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        flash("success", editId ? "Skill updated!" : "Skill added!");
        closeForm();
        setReloadKey((k) => k + 1);
      } else {
        flash("error", data.message || "Failed to save skill");
      }
    } catch {
      flash("error", "Unable to connect to server");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this skill category?")) return;

    try {
      const res = await fetch(`${API}/api/portfolio/skills/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        flash("success", "Skill deleted");
        setSkills(skills.filter((s) => s._id !== id));
      } else {
        flash("error", data.message || "Failed to delete");
      }
    } catch {
      flash("error", "Unable to connect to server");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-lg bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bricolage text-xl font-bold text-white mb-1">
            Skills
          </h2>
          <p className="text-white/40 font-sans text-sm">
            {skills.length} categor{skills.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 rounded-lg bg-white text-black font-sans font-semibold text-sm hover:bg-white/90 transition-colors"
        >
          + Add Skill
        </button>
      </div>

      {status && (
        <div
          className={`px-4 py-3 rounded-lg text-sm mb-5 ${
            status.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {status.text}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bricolage text-lg font-semibold text-white">
                {editId ? "Edit Skill Category" : "Add Skill Category"}
              </h3>
              <button
                onClick={closeForm}
                className="text-white/40 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                  placeholder="Frontend, Backend, DevOps..."
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
                  Skills
                  <span className="text-white/20 normal-case tracking-normal ml-2">
                    (comma-separated)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.items}
                  onChange={(e) => setForm({ ...form, items: e.target.value })}
                  required
                  placeholder="React, Vue, Angular, Svelte"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-lg bg-white text-black font-sans font-semibold text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : editId ? "Update" : "Add Skill"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 py-3 rounded-lg border border-white/10 text-white/60 font-sans text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skills list */}
      {skills.length === 0 ? (
        <div className="text-center py-16 border border-white/10 rounded-xl bg-white/[0.02]">
          <p className="text-white/30 font-sans text-sm">No skills yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex-1 min-w-0 mr-4">
                <h3 className="font-bricolage font-semibold text-white mb-1.5">
                  {skill.category}
                </h3>
                {Array.isArray(skill.items) && (
                  <div className="flex flex-wrap gap-1.5">
                    {skill.items.map((item, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/40 font-sans"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(skill)}
                  className="px-3 py-1.5 rounded-lg text-xs font-sans text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-sans text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
