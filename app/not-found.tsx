import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0e12] text-[#eae8e3] flex flex-col items-center justify-center px-6 selection:bg-[#c8a97e]/30">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[#c8a97e]">
          <span>404</span>
          <span>·</span>
          <span>Página Não Encontrada</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#eae8e3] font-normal leading-snug">
          O endereço solicitado não está disponível.
        </h1>

        <p className="text-xs sm:text-sm text-[#9d9ba7] font-light leading-relaxed">
          Verifique o link digitado ou retorne à página inicial da UpSell.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.15em] text-[#0d0e12] bg-[#eae8e3] hover:bg-[#c8a97e] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retornar ao Início</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
