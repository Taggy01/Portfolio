import { useState, useEffect } from "react";
import api from "../../api";

const EMPTY_ACHIEVEMENT = { title: "", description: "", date: "", icon: "" };

export default function AchievementsManager() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...EMPTY_ACHIEVEMENT });
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
    const fetchAchievements = async () => {
      try {
        const { data } = await api.get("/api/portfolio/achievements", {
          withCredentials: true,
        });
        if (data.success && Array.isArray(data.data)) {
          setAchievements(data.data);
        }
      } catch {
        flash("error", "Failed to load achievements");
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [reloadKey]);

  const openAdd = () => {
    setEditId(null);
    setForm({ ...EMPTY_ACHIEVEMENT });
    setShowForm(true);
  };

  const openEdit = (ach) => {
    setEditId(ach._id);
    setForm({
      title: ach.title || "",
      description: ach.description || "",
      date: ach.date || "",
      icon: ach.icon || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ ...EMPTY_ACHIEVEMENT });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data } = await api.request({
        url: editId
          ? `/api/portfolio/achievements/${editId}`
          : "/api/portfolio/achievements",
        method: editId ? "PUT" : "POST",
        data: form,
        withCredentials: true,
      });

      if (data.success) {
        flash("success", editId ? "Achievement updated!" : "Achievement added!");
        closeForm();
        setReloadKey((k) => k + 1);
      } else {
        flash("error", data.message || "Failed to save achievement");
      }
    } catch (error) {
      flash(
        "error",
        error.response?.data?.message || "Unable to connect to server"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this achievement?")) return;

    try {
      const { data } = await api.delete(`/api/portfolio/achievements/${id}`, {
        withCredentials: true,
      });
      if (data.success) {
        flash("success", "Achievement deleted");
        setAchievements(achievements.filter((a) => a._id !== id));
      } else {
        flash("error", data.message || "Failed to delete");
      }
    } catch (error) {
      flash(
        "error",
        error.response?.data?.message || "Unable to connect to server"
      );
    }
  };

  const QUICK_ICONS = ["🏆", "🎯", "🥇", "🌟", "💡", "📜", "🎓", "🔥", "✅", "🚀"];

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
            Achievements
          </h2>
          <p className="text-white/40 font-sans text-sm">
            {achievements.length} achievement{achievements.length !== 1 && "s"}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 rounded-lg bg-white text-black font-sans font-semibold text-sm hover:bg-white/90 transition-colors"
        >
          + Add Achievement
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
          <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bricolage text-lg font-semibold text-white">
                {editId ? "Edit Achievement" : "Add Achievement"}
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
                  Icon
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="🏆"
                    className="w-20 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-center text-lg placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setForm({ ...form, icon })}
                        className={`w-8 h-8 rounded flex items-center justify-center text-sm hover:bg-white/10 transition-colors ${
                          form.icon === icon
                            ? "bg-white/15 ring-1 ring-white/30"
                            : "bg-white/5"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="Achievement title"
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
                  placeholder="Brief description"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors resize-y"
                />
              </div>

              <div>
                <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="2024, Jan 2024, etc."
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-lg bg-white text-black font-sans font-semibold text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : editId ? "Update" : "Add Achievement"}
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

      {/* Achievements list */}
      {achievements.length === 0 ? (
        <div className="text-center py-16 border border-white/10 rounded-xl bg-white/[0.02]">
          <p className="text-white/30 font-sans text-sm">No achievements yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements.map((ach) => (
            <div
              key={ach._id}
              className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0 mr-4">
                <span className="text-2xl shrink-0">{ach.icon || "🏆"}</span>
                <div className="min-w-0">
                  <h3 className="font-bricolage font-semibold text-white truncate">
                    {ach.title}
                  </h3>
                  {ach.description && (
                    <p className="text-white/40 font-sans text-sm mt-0.5 line-clamp-1">
                      {ach.description}
                    </p>
                  )}
                  {ach.date && (
                    <span className="text-white/20 font-sans text-xs mt-1 inline-block">
                      {ach.date}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(ach)}
                  className="px-3 py-1.5 rounded-lg text-xs font-sans text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ach._id)}
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
