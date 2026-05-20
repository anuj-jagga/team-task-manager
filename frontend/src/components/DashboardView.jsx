import React from 'react';
import { LayoutDashboard, FolderKanban, ListTodo, User as UserIcon, Calendar, AlertTriangle, Clock, CheckCircle2, Sparkles, Plus } from 'lucide-react';

export default function DashboardView({
  user,
  tasks,
  projects,
  stats,
  setCurrentTab,
  setSelectedProjectId,
  selectedProjectId,
  handleUpdateTaskStatus,
  handleSeedDatabase
}) {
  const getInitials = (name) => {
    if (!name) return 'UN';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (task) => {
    if (task.status === 'Done') return false;
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  };

  if (projects.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
          <FolderKanban size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-200">No active projects found</h3>
        <p className="text-slate-400 text-sm max-w-md">
          To get started, create a project from the "Projects" tab. If you are a member, ask your Administrator to add a project.
        </p>
        {user?.role === 'Admin' ? (
          <button
            onClick={() => setCurrentTab('projects')}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl flex items-center gap-2 text-sm font-semibold transition-all"
          >
            <Plus size={16} />
            Go to Projects Setup
          </button>
        ) : (
          <button
            onClick={handleSeedDatabase}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-indigo-300 border border-indigo-500/20 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all"
          >
            <Sparkles size={16} />
            Seed Workspace Sample Data
          </button>
        )}
      </div>
    );
  }

  const assignedToMe = tasks.filter(t => t.assignedTo?._id === user?.id);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100">Welcome Back, {user?.name}</h1>
        <p className="text-slate-400 text-sm mt-1">Here is a quick snapshot of the workspace activities and assignments.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Tasks Card */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between h-36 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Total Tasks</span>
            <ListTodo size={20} className="text-indigo-400" />
          </div>
          <div>
            <span className="text-3xl font-extrabold">{stats.total}</span>
            <span className="text-xs text-slate-400 block mt-1">across current project</span>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between h-36 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">In Progress</span>
            <Clock size={20} className="text-amber-400" />
          </div>
          <div>
            <span className="text-3xl font-extrabold">{stats.inProgress}</span>
            <span className="text-xs text-slate-400 block mt-1">{stats.todo} waiting in backlog</span>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between h-36 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 size={20} className="text-emerald-400" />
          </div>
          <div>
            <span className="text-3xl font-extrabold">{stats.completed}</span>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">{stats.completionRate}% completion rate</span>
          </div>
        </div>

        {/* Overdue Tasks Card */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between h-36 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Overdue</span>
            <AlertTriangle size={20} className="text-rose-400" />
          </div>
          <div>
            <span className={`text-3xl font-extrabold ${stats.overdue > 0 ? 'text-rose-400' : 'text-slate-100'}`}>
              {stats.overdue}
            </span>
            <span className="text-xs text-slate-400 block mt-1">requires immediate review</span>
          </div>
        </div>

      </div>

      {/* Dashboard Sub-content: My Tasks & Project Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Tasks assigned to me */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2">
              <UserIcon size={18} className="text-indigo-400" />
              Assigned To Me ({assignedToMe.length})
            </h3>
            <button 
              onClick={() => setCurrentTab('tasks')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Open Kanban Board
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[300px]">
            {assignedToMe.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                No tasks currently assigned to you for this project. Keep it up!
              </div>
            ) : (
              assignedToMe.map(task => (
                <div 
                  key={task._id}
                  className="p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-slate-200 text-sm line-clamp-1">{task.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{task.description || 'No description provided.'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        task.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-white/5'
                      }`}>
                        {task.status}
                      </span>
                      {task.dueDate && (
                        <span className={`text-[10px] flex items-center gap-1 ${
                          isOverdue(task) ? 'text-rose-400' : 'text-slate-400'
                        }`}>
                          <Calendar size={10} />
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <select
                      className="px-2 py-1 rounded bg-slate-900 border border-white/10 text-xs focus:outline-none text-slate-300"
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Project Progress Check */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-lg text-slate-200">Projects Progress</h3>
          
          <div className="space-y-4 overflow-y-auto max-h-[300px]">
            {projects.map(proj => (
              <div 
                key={proj._id} 
                onClick={() => setSelectedProjectId(proj._id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedProjectId === proj._id 
                    ? 'bg-indigo-600/10 border-indigo-500/30' 
                    : 'bg-white/2 border-white/5 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-200 truncate max-w-[150px]">{proj.name}</span>
                  <span className="text-indigo-400">
                    {selectedProjectId === proj._id ? `${stats.completionRate}%` : 'View'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1 mb-2">
                  {proj.description || 'No description provided.'}
                </p>
                {selectedProjectId === proj._id && (
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div 
                      className="bg-indigo-500 h-1 rounded-full transition-all duration-300" 
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
