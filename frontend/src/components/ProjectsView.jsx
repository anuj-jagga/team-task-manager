import React from 'react';
import { FolderKanban, Plus, Trash2, Calendar, Shield } from 'lucide-react';

export default function ProjectsView({
  user,
  projects,
  selectedProjectId,
  setSelectedProjectId,
  showProjectModal,
  setShowProjectModal,
  projectForm,
  setProjectForm,
  handleCreateProject,
  handleDeleteProject
}) {
  const getInitials = (name) => {
    if (!name) return 'UN';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Workspace Projects</h1>
          <p className="text-slate-400 text-sm mt-1">Select, configure and view metrics of the team workspaces.</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setShowProjectModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-650 hover:to-violet-700 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/10 transition-all transform hover:scale-[1.02]"
          >
            <Plus size={16} />
            New Project
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="md:col-span-3 text-center py-20 text-slate-500">
            No projects set up yet. Make sure to seed or create one.
          </div>
        ) : (
          projects.map(proj => (
            <div
              key={proj._id}
              onClick={() => setSelectedProjectId(proj._id)}
              className={`glass-card p-6 rounded-3xl cursor-pointer transition-all duration-300 relative border flex flex-col justify-between min-h-[180px] ${
                selectedProjectId === proj._id
                  ? 'border-indigo-500 bg-indigo-600/5 ring-1 ring-indigo-500/20'
                  : 'border-white/5 hover:border-white/10 hover:bg-white/5'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <FolderKanban size={20} />
                  </div>
                  {user?.role === 'Admin' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this project? All associated tasks will be permanently removed.')) {
                          handleDeleteProject(proj._id);
                        }
                      }}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-500/10 transition-all"
                      title="Delete Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-100 group-hover:text-indigo-400 transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">
                    {proj.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Creator details */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-[9px] font-bold flex items-center justify-center text-slate-300">
                    {getInitials(proj.createdBy?.name)}
                  </div>
                  <span>{proj.createdBy?.name || 'Administrator'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={10} />
                  <span>{formatDate(proj.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Project Creator */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 rounded-3xl shadow-2xl relative">
            <h3 className="text-xl font-bold mb-1">Create Workspace Project</h3>
            <p className="text-slate-400 text-xs mb-6">Setup new workspace containers for allocating kanban tasks.</p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Collaborative Chat Sync"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-100 text-sm"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</label>
                <textarea
                  placeholder="Summarize the core scope and milestone criteria..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-100 text-sm h-24 resize-none"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/5 hover:bg-white/5 text-slate-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
