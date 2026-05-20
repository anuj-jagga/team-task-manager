import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md transition-all duration-300 animate-fade-in flex items-center gap-2 ${
      toast.type === 'error' 
        ? 'bg-rose-950/80 border-rose-500/30 text-rose-200' 
        : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200'
    }`}>
      {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
      <span>{toast.message}</span>
    </div>
  );
}
