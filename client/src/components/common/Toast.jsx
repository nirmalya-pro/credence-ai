import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Toast() {
  const { toast, showToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-brand-700 flex-shrink-0" />
  };

  const borderStyles = {
    success: 'border-emerald-200 bg-white text-emerald-950',
    warning: 'border-amber-200 bg-white text-amber-950',
    error: 'border-red-200 bg-white text-red-950',
    info: 'border-slate-200 bg-white text-slate-900'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm shadow-lg">
      <div className={`flex items-start gap-2.5 p-3.5 rounded border ${borderStyles[toast.type] || borderStyles.info}`}>
        {icons[toast.type] || icons.info}
        <div className="text-xs font-medium pr-2 leading-relaxed">
          {toast.message}
        </div>
        <button
          onClick={() => showToast(null)}
          className="text-slate-400 hover:text-slate-600 ml-auto p-0.5 rounded"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
