import React from 'react';
import { Loader2, Cpu } from 'lucide-react';

export default function LoadingSpinner({ message = 'Computing semantic similarity with all-MiniLM-L6-v2...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
        <Cpu className="w-6 h-6 text-indigo-600 absolute animate-pulse" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-700">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Generating 384-dimensional dense embeddings & cosine matrix</p>
    </div>
  );
}
