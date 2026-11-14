import { useState, useEffect } from "react";
import api from "../../api";

const EMPTY_PROJECT = {
  number: "",
  name: "",
  type: "",
  description: "",
  githubUrl: "",
  liveUrl: "",
  stack: "",
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...EMPTY_PROJECT });
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
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/api/portfolio/projects", {
          withCredentials: true,
        });
        if (data.success && Array.isArray(data.data)) {
          setProjects(data.data);
        }
      } catch {
        flash("error", "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [reloadKey]);

  const openAdd = () => {
    setEditId(null);
    setForm({ ...EMPTY_PROJECT });
    setShowForm(true);
  };

  const openEdit = (project) => {
    setEditId(project._id);
    setForm({
      number: project.number || "",
      name: project.name || "",
      type: project.type || "",
      description: project.description || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      stack: Array.isArray(project.stack)
        ? project.stack.join(", ")
        : project.stack || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ ...EMPTY_PROJECT });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      number: Number(form.number) || 0,
      stack: form.stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const { data } = await api.request({
        url: editId
          ? `/api/portfolio/projects/${editId}`
          : "/api/portfolio/projects",
        method: editId ? "PUT" : "POST",
        data: payload,
        withCredentials: true,
      });

      if (data.success) {
        flash("success", editId ? "Project updated!" : "Project added!");
        closeForm();
        setReloadKey((k) => k + 1);
      } else {
        flash("error", data.message || "Failed to save project");
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
    if (!confirm("Delete this project?")) return;

    try {
      const { data } = await api.delete(`/api/portfolio/projects/${id}`, {
        withCredentials: true,
      });
      if (data.success) {
        flash("success", "Project deleted");
        setProjects(projects.filter((p) => p._id !== id));
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
            Projects
          </h2>
          <p className="text-white/40 font-sans text-sm">
            {projects.length} project{projects.length !== 1 && "s"}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 rounded-lg bg-white text-black font-sans font-semibold text-sm hover:bg-white/90 transition-colors"
        >
          + Add Project
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

      {/* Modal / Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bricolage text-lg font-semibold text-white">
                {editId ? "Edit Project" : "Add Project"}
              </h3>
              <button
                onClick={closeForm}
                className="text-white/40 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
                    Number
                  </label>
                  <input
                    type="number"
                    value={form.number}
                    onChange={(e) => setForm({ ...form, number: e.target.value })}
                    placeholder="01"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
                    Type
                  </label>
                  <input
                    type="text"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    placeholder="Web App"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Project Name"
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
                  placeholder="Brief description of the project"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors resize-y"
                />
              </div>

              <div>
                <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
                  Tech Stack
                  <span className="text-white/20 normal-case tracking-normal ml-2">
                    (comma-separated)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.stack}
                  onChange={(e) => setForm({ ...form, stack: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/repository"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-sans uppercase tracking-wider mb-2">
                    Live Project URL
                  </label>
                  <input
                    type="url"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    placeholder="https://your-project.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-lg bg-white text-black font-sans font-semibold text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : editId ? "Update" : "Add Project"}
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

      {/* Project list */}
      {projects.length === 0 ? (
        <div className="text-center py-16 border border-white/10 rounded-xl bg-white/[0.02]">
          <p className="text-white/30 font-sans text-sm">No projects yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-3 mb-1">
                  {project.number && (
                    <span className="text-white/20 font-mono text-xs">
                      #{String(project.number).padStart(2, "0")}
                    </span>
                  )}
                  <h3 className="font-bricolage font-semibold text-white truncate">
                    {project.name}
                  </h3>
                  {project.type && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 font-sans">
                      {project.type}
                    </span>
                  )}
                </div>
                {project.stack && Array.isArray(project.stack) && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {project.stack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/30 font-sans"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(project)}
                  className="px-3 py-1.5 rounded-lg text-xs font-sans text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
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
