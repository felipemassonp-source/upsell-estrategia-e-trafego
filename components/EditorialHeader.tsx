'use client';

import React, { useState } from 'react';
import { UserRole } from '@/lib/types';
import { ArrowUpRight, Lock, UserCheck, Menu, X, MapPin } from 'lucide-react';

interface EditorialHeaderProps {
  onOpenAuth: () => void;
  userRole: UserRole;
  onGoToPortal: () => void;
}

export function EditorialHeader({ onOpenAuth, userRole, onGoToPortal }: EditorialHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      'Olá! Gostaria de conversar com a equipe da UPSELL sobre a estratégia e tráfego do meu negócio.'
    );
    window.open(`https://api.whatsapp.com/send?phone=5511987654321&text=${text}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0e12]/90 backdrop-blur-md hairline-b transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-5 flex items-center justify-between gap-8">
        {/* Brand Lockup */}
        <a href="#" className="flex items-center gap-3 group">
          <span className="text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#eae8e3] group-hover:text-white transition-colors uppercase">
            UPSELL
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#c8a97e]/60" />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#8e8d96] font-light">
            <MapPin className="w-3 h-3 text-[#c8a97e]" />
            Florianópolis, SC
          </span>
        </a>

        {/* Central Navigation Links */}
        <nav className="hidden md:flex items-center gap-9 text-xs font-medium tracking-wide text-[#9d9ba7]">
          <a href="#manifesto" className="link-editorial hover:text-[#eae8e3] transition-colors">
            Manifesto
          </a>
          <a href="#tese" className="link-editorial hover:text-[#c8a97e] transition-colors">
            A Tese
          </a>
          <a href="#atuacao" className="link-editorial hover:text-[#eae8e3] transition-colors">
            Atuação
          </a>
          <a href="#portal" className="link-editorial hover:text-[#c8a97e] transition-colors font-semibold text-[#dfc7a7]">
            O Portal
          </a>
          <a href="#filosofia" className="link-editorial hover:text-[#eae8e3] transition-colors">
            Filosofia
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          {userRole !== 'guest' ? (
            <button
              type="button"
              onClick={onGoToPortal}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#c8a97e] hover:text-[#dfc7a7] transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Acessar {userRole === 'admin' ? 'Painel Gestor' : 'Portal'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-normal text-[#9d9ba7] hover:text-[#eae8e3] transition-colors tracking-wide"
            >
              <Lock className="w-3 h-3 text-[#c8a97e]" />
              <span>Portal do Cliente</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleWhatsApp}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-[#0d0e12] bg-[#eae8e3] hover:bg-[#c8a97e] rounded-full transition-all duration-300 shadow-sm overflow-hidden"
          >
            <span className="relative z-10 font-semibold tracking-wide">Iniciar Diálogo</span>
            <ArrowUpRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 text-[#eae8e3] hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-6 py-6 bg-[#0d0e12] hairline-b space-y-4 text-xs">
          <nav className="flex flex-col gap-3 text-sm text-[#9d9ba7]">
            <a
              href="#manifesto"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white py-1"
            >
              Manifesto
            </a>
            <a
              href="#tese"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#c8a97e] py-1 font-medium"
            >
              A Tese
            </a>
            <a
              href="#atuacao"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white py-1"
            >
              Atuação
            </a>
            <a
              href="#portal"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#c8a97e] font-semibold py-1"
            >
              O Portal do Cliente
            </a>
            <a
              href="#filosofia"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white py-1"
            >
              Filosofia
            </a>
          </nav>
          <div className="pt-3 hairline-t flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="flex items-center gap-2 text-[#9d9ba7] hover:text-white py-1"
            >
              <Lock className="w-3 h-3 text-[#c8a97e]" />
              <span>Portal do Cliente</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleWhatsApp();
              }}
              className="flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-[#0d0e12] bg-[#eae8e3] rounded-full"
            >
              <span>Iniciar Diálogo no WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
