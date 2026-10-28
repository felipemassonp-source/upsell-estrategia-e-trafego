'use client';

import React from 'react';
import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';

interface EditorialFooterProps {
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}

export function EditorialFooter({ onOpenAuth, onOpenAdmin }: EditorialFooterProps) {
  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      'Olá! Gostaria de conversar com a equipe da UPSELL em Florianópolis sobre a estratégia e tráfego do meu negócio.'
    );
    window.open(`https://api.whatsapp.com/send?phone=5511987654321&text=${text}`, '_blank');
  };

  return (
    <footer className="pt-24 sm:pt-32 pb-16 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Big Conversation Invitation */}
      <div className="pb-20 hairline-b max-w-4xl space-y-8">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#c8a97e] block font-light">
          Próximo Passo
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#eae8e3] font-normal leading-[1.1] [text-wrap:balance]">
          Vamos compreender o momento e o posicionamento <span className="italic text-[#dfc7a7]">do seu negócio.</span>
        </h2>

        <p className="text-sm sm:text-base text-[#9d9ba7] leading-relaxed font-light max-w-xl">
          Uma conversa direta, franca e sem promessas fáceis. Analisamos a estrutura da sua empresa, o tom da sua comunicação e como construir reconhecimento perante quem decide no seu mercado.
        </p>

        <div className="pt-4">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.15em] text-[#0d0e12] bg-[#eae8e3] hover:bg-[#c8a97e] transition-all duration-300 shadow-lg"
          >
            <span>Iniciar Diálogo Estratégico</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-14 hairline-b text-xs text-[#9d9ba7]">
        <div className="space-y-3">
          <span className="text-sm font-bold tracking-[0.2em] text-[#eae8e3] uppercase block">
            UPSELL
          </span>
          <p className="text-[#8e8d96] font-light leading-relaxed">
            Estratégia e Tráfego Pago com foco em reconhecimento, autoridade e solidez. Florianópolis, SC.
          </p>
        </div>

        <div className="space-y-2.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#eae8e3] font-semibold block mb-3">
            Navegação
          </span>
          <div><a href="#manifesto" className="hover:text-white transition-colors">Manifesto</a></div>
          <div><a href="#tese" className="hover:text-[#c8a97e] transition-colors">A Tese do Reconhecimento</a></div>
          <div><a href="#atuacao" className="hover:text-white transition-colors">Nossa Atuação</a></div>
          <div><a href="#portal" className="hover:text-[#c8a97e] transition-colors font-medium">O Portal do Cliente</a></div>
          <div><a href="#filosofia" className="hover:text-white transition-colors">Filosofia de Parceria</a></div>
        </div>

        <div className="space-y-2.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#eae8e3] font-semibold block mb-3">
            Plataforma
          </span>
          <div>
            <button
              type="button"
              onClick={onOpenAuth}
              className="hover:text-[#c8a97e] transition-colors text-left"
            >
              Área do Cliente (Portal)
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="hover:text-[#dfc7a7] transition-colors text-left"
            >
              Painel Administrativo (Gestor)
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#eae8e3] font-semibold block mb-3">
            Sede em Florianópolis
          </span>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#c8a97e] shrink-0" />
            <span>Florianópolis, SC · Brasil</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#c8a97e] shrink-0" />
            <span>contato@upsell.com.br</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#c8a97e] shrink-0" />
            <span>+55 (48) 99876-5432</span>
          </div>
        </div>
      </div>

      {/* Copyright & Subline */}
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8e8d96] font-light">
        <span suppressHydrationWarning>
          © {new Date().getFullYear()} UPSELL Estratégia e Tráfego Pago Ltda. Florianópolis, SC. Todos os direitos reservados.
        </span>
        <span>
          Direção de arte & engenharia editorial independente.
        </span>
      </div>
    </footer>
  );
}
