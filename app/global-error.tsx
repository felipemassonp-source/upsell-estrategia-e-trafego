'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#0d0e12] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-xl font-bold text-[#c8a97e]">Erro Crítico</h2>
          <p className="text-xs text-slate-400">
            {error?.message || 'Falha na renderização raiz da aplicação.'}
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#c8a97e] text-black text-xs font-bold hover:bg-[#dfc7a7] transition-all cursor-pointer"
          >
            Recarregar Aplicação
          </button>
        </div>
      </body>
    </html>
  );
}
