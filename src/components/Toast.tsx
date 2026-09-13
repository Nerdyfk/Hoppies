import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types.ts';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
  };

  const styleClasses = {
    success: 'bg-slate-900/95 dark:bg-slate-900/95 border-emerald-500/40 text-slate-100 shadow-emerald-500/10',
    error: 'bg-slate-900/95 dark:bg-slate-900/95 border-rose-500/40 text-slate-100 shadow-rose-500/10',
    warning: 'bg-slate-900/95 dark:bg-slate-900/95 border-amber-500/40 text-slate-100 shadow-amber-500/10',
    info: 'bg-slate-900/95 dark:bg-slate-900/95 border-sky-500/40 text-slate-100 shadow-sky-500/10',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5">
      <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl ${styleClasses[toast.type]}`}>
        <div className="mt-0.5">{icons[toast.type]}</div>
        <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-md"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
