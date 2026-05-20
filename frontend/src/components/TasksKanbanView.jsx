import React from 'react';
import { Plus, Trash2, Calendar, AlertTriangle, User as UserIcon, Shield, Filter } from 'lucide-react';

export default function TasksKanbanView({
  user,
  tasks,
  projects,
  users,
  selectedProjectId,
  setSelectedProjectId,
  showTaskModal,
  setShowTaskModal,
  taskForm,
  setTaskForm,
  handleCreateTask,
  handleUpdateTaskStatus,
  handleUpdateTaskAssignee,
  handleDeleteTask
}) {
  const getInitials = (name) => {
    if (!name) return 'UN';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (task) => {
    if (task.status === 'Done') return false;
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  };

  const columns = ['To Do', 'In Progress', 'Done'];

  const getTasksByColumn = (colName) => {
    return tasks.filter(task => task.status === colName);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header controls & Project Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            Kanban Board
          </h1>
          <p className="text-slate-400 text-sm mt-1">Assign roles, set milestones, and update status columns.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-400 font-semibold">
            <Filter size={14} className="text-indigo-400" />
            <span>Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              {projects.map(p => (
                <option key={p._id} value={p._id} className="bg-slate-900 text-slate-200">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {user?.role === 'Admin' && selectedProjectId && (
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-650 hover:to-violet-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/10 transition-all transform hover:scale-[1.02]"
            >
              <Plus size={14} />
              Add Task
            </button>
          )}
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {columns.map(col => {
          const colTasks = getTasksByColumn(col);
          return (
            <div key={col} className="glass-card rounded-3xl p-5 flex flex-col space-y-4 min-h-[500px]">
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    col === 'Done' ? 'bg-emerald-500' :
                    col === 'In Progress' ? 'bg-amber-500' :
                    'bg-slate-400'
                  }`}></span>
                  <h3 className="font-bold text-slate-200">{col}</h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-400 font-semibold">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List inside Column */}
              <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
                {colTasks.length === 0 ? (
                  <div className="text-center py-10 text-slate-600 text-xs border border-dashed border-white/5 rounded-2xl">
                    No tasks in {col}
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div
                      key={task._id}
                      className="p-5 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all duration-300 space-y-4 group relative hover:border-white/10"
                    >
                      {/* Task Info */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-slate-200 text-sm group-hover:text-indigo-400 transition-colors line-clamp-2">
                            {task.title}
                          </h4>
                          {user?.role === 'Admin' && (
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this task?')) {
                                  handleDeleteTask(task._id);
                                }
                              }}
                              className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                              title="Delete Task"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-3">{task.description || 'No description.'}</p>
                      </div>

                      {/* Info & Selectors Row */}
                      <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
                        {/* Due Date & Overdue badge */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            {formatDate(task.dueDate)}
                          </span>
                          {isOverdue(task) && (
                            <span className="flex items-center gap-0.5 text-rose-400 font-bold bg-rose-955/20 px-1.5 py-0.5 rounded border border-rose-500/10">
                              <AlertTriangle size={8} />
                              Overdue
                            </span>
                          )}
                        </div>

                        {/* Assignee Selection */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <UserIcon size={12} className="text-slate-500" />
                            <select
                              value={task.assignedTo?._id || ''}
                              onChange={(e) => handleUpdateTaskAssignee(task._id, e.target.value)}
                              className="bg-transparent border-none text-[11px] text-slate-300 font-medium focus:ring-0 max-w-[110px] truncate cursor-pointer"
                            >
                              <option value="">Unassigned</option>
                              {users.map(u => (
                                <option key={u._id} value={u._id} className="bg-slate-900 text-slate-200">
                                  {u.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Quick Status toggle dropdown */}
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-[10px] focus:outline-none text-slate-400"
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 rounded-3xl shadow-2xl relative">
            <h3 className="text-xl font-bold mb-1">Create Kanban Task</h3>
            <p className="text-slate-400 text-xs mb-6">Allocate project milestone deliverables and assign roles.</p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireframe User Settings"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-100 text-sm"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</label>
                <textarea
                  placeholder="Summarize the instructions, expectations, and checklist for this task..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-100 text-sm h-20 resize-none"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Assign To</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-300 text-sm focus:outline-none"
                    value={taskForm.assignedTo}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  >
                    <option value="" className="bg-slate-900">Unassigned</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id} className="bg-slate-900">
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-300 text-sm"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/5 hover:bg-white/5 text-slate-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
