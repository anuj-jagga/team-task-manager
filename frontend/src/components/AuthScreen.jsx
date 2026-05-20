import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AuthScreen({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  handleAuthSubmit,
  handleSeedDatabase,
  loading
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-8 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Header */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-500/20">
            T
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            TeamTask
          </span>
        </div>
        
        <button 
          onClick={handleSeedDatabase}
          className="text-xs md:text-sm px-4 py-2 rounded-xl glass-card hover:bg-white/10 text-indigo-300 transition-all border border-indigo-500/20 hover:border-indigo-500/50 flex items-center gap-2"
        >
          <Sparkles size={14} />
          Seed Initial Data
        </button>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-md mx-auto my-12 z-10 animate-fade-in">
        <div className="glass-card p-8 rounded-3xl shadow-2xl relative">
          <h2 className="text-2xl font-bold text-center mb-2">
            {authMode === 'login' ? 'Sign In to Your Workspace' : 'Create Collaborative Account'}
          </h2>
          <p className="text-slate-400 text-sm text-center mb-8">
            {authMode === 'login' ? 'Manage tasks, track progress and view dashboard metrics' : 'Assign roles, schedule deliverables and manage projects'}
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-5">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Anuj Jagga"
                  className="w-full px-4 py-3 rounded-xl glass-input text-slate-100"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                required
                placeholder="anuj@taskmanager.com"
                className="w-full px-4 py-3 rounded-xl glass-input text-slate-100"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl glass-input text-slate-100"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Workspace Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAuthForm({ ...authForm, role: 'Member' })}
                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                      authForm.role === 'Member'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400'
                    }`}
                  >
                    Member (Default)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthForm({ ...authForm, role: 'Admin' })}
                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                      authForm.role === 'Admin'
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                        : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400'
                    }`}
                  >
                    Workspace Admin
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-650 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : authMode === 'login' ? 'Sign In' : 'Register Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-400">
              {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
            </span>{' '}
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-indigo-400 hover:underline font-medium ml-1"
            >
              {authMode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full text-center text-xs text-slate-500 z-10 mt-8">
        Team Task Manager Assignment • Handcrafted for Selection Process • 2026
      </div>
    </div>
  );
}
