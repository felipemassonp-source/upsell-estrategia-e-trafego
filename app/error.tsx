'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App-level error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0d0e12] text-[#eae8e3] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <h2 className="text-xl font-bold text-[#c8a97e]">Algo deu errado</h2>
        <p className="text-xs text-slate-400">
          {error?.message || 'Ocorreu um erro inesperado ao carregar a interface.'}
        </p>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-[#c8a97e] text-black text-xs font-bold hover:bg-[#dfc7a7] transition-all cursor-pointer"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
}
