import React from 'react';
import { LayoutDashboard, FolderKanban, ListTodo, LogOut, Shield } from 'lucide-react';

export default function Navbar({ user, currentTab, setCurrentTab, handleLogout }) {
  const getInitials = (name) => {
    if (!name) return 'UN';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-md">
              T
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              TeamTask
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-indigo-600/10 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>

            <button
              onClick={() => setCurrentTab('projects')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'projects'
                  ? 'bg-indigo-600/10 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <FolderKanban size={16} />
              Projects
            </button>

            <button
              onClick={() => setCurrentTab('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'tasks'
                  ? 'bg-indigo-600/10 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <ListTodo size={16} />
              Task Board
            </button>
          </nav>
        </div>

        {/* User profile dropdown & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 text-xs sm:text-sm">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs">
              {getInitials(user?.name)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-semibold text-slate-200 max-w-[120px] truncate">{user?.name}</p>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Shield size={10} className="text-violet-400" />
                <span>{user?.role}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-all border border-transparent hover:border-rose-500/20"
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden border-t border-white/5 bg-slate-950/90 flex justify-around py-2">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-xs transition-all ${
            currentTab === 'dashboard' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setCurrentTab('projects')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-xs transition-all ${
            currentTab === 'projects' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <FolderKanban size={18} />
          <span>Projects</span>
        </button>
        <button
          onClick={() => setCurrentTab('tasks')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-xs transition-all ${
            currentTab === 'tasks' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <ListTodo size={18} />
          <span>Tasks</span>
        </button>
      </div>
    </header>
  );
}
