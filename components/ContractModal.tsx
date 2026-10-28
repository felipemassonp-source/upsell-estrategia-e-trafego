'use client';

import React, { useEffect, useState } from 'react';
import { ClientProfile } from '@/lib/types';
import { X, FileText, CheckCircle2, Download, Printer, ShieldCheck, ExternalLink } from 'lucide-react';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientProfile;
  isLight?: boolean;
}

export function ContractModal({ isOpen, onClose, client, isLight = false }: ContractModalProps) {
  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (client.links.contractPdf && client.links.contractPdf.startsWith('http')) {
      window.open(client.links.contractPdf, '_blank');
      setDownloadFeedback('Documento PDF oficial aberto em nova aba para download.');
    } else {
      // Trigger a clean plain text download with the contract terms
      const contractText = `===================================================================
UPSELL ESTRATÉGIA E TRÁFEGO PAGO LTDA — INSTRUMENTO CONTRATUAL
Identificador: CONTRATO-UPS-${client.id.toUpperCase()}-2024
===================================================================

CONTRATADA: UPSELL ESTRATÉGIA E TRÁFEGO PAGO LTDA
CNPJ: 48.912.304/0001-82 | Florianópolis, SC & São Paulo, SP

CONTRATANTE: ${client.companyName.toUpperCase()}
Responsável: ${client.responsibleName} | E-mail: ${client.email}

VIGÊNCIA: De ${client.contractStart} até ${client.contractRenewal}
STATUS: ${client.contractStatus}

CLÁUSULA 1ª — DO OBJETO E ESCOPO:
${client.scope.map((s, idx) => `  ${idx + 1}. ${s}`).join('\n')}

CLÁUSULA 2ª — TRANSPARÊNCIA RADICAL E TITULARIDADE:
Todas as contas de anúncios, acessos e pixels pertencem 100% à CONTRATANTE.

ASSINATURA DIGITAL:
ICP-Brasil / Token SHA-256: ${client.responsibleName} (Autenticado)
Pela Contratada: Diretoria de Operações Upsell
`;
      const blob = new Blob([contractText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contrato-upsell-${client.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloadFeedback(`Arquivo "contrato-upsell-${client.id}.txt" baixado com sucesso.`);
    }

    setTimeout(() => {
      setDownloadFeedback(null);
    }, 4000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`border rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative my-8 transition-colors ${
          isLight
            ? 'bg-white border-slate-300 text-slate-950 shadow-[0_20px_50px_rgba(15,23,42,0.15)]'
            : 'bg-[#0f1117] border-white/10 text-[#eae8e3]'
        }`}
      >
        {/* Header Bar */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900/60 border-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl border ${
                isLight
                  ? 'bg-[#ed1c24]/10 text-[#ed1c24] border-[#ed1c24]/25'
                  : 'bg-[#ed1c24]/15 text-[#ed1c24] border-[#ed1c24]/30'
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Instrumento Particular de Prestação de Serviços de Tráfego e Inteligência
              </h3>
              <p className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                Identificador: CONTRATO-UPS-{client.id.toUpperCase()}-2024
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Fechar contrato (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message banner */}
        {downloadFeedback && (
          <div
            className={`px-6 py-2.5 border-b text-xs flex items-center gap-2 font-medium ${
              isLight
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{downloadFeedback}</span>
          </div>
        )}

        {/* Contract Content Body */}
        <div
          className={`p-6 sm:p-8 max-h-[65vh] overflow-y-auto text-sm space-y-6 leading-relaxed ${
            isLight ? 'text-slate-800' : 'text-slate-300'
          }`}
        >
          {/* Parties */}
          <div
            className={`p-4 rounded-xl border space-y-3 ${
              isLight ? 'bg-slate-100/80 border-slate-300' : 'bg-slate-900/40 border-white/5'
            }`}
          >
            <h4
              className="text-xs font-bold uppercase tracking-wider text-[#ed1c24]"
            >
              Partes Contratantes
            </h4>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
              <strong className={isLight ? 'text-slate-950 font-black' : 'text-white'}>CONTRATADA:</strong> UPSELL
              ESTRATÉGIA E TRÁFEGO PAGO LTDA, inscrita no CNPJ sob o nº 48.912.304/0001-82, com sede em Florianópolis - SC.
            </p>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
              <strong className={isLight ? 'text-slate-950 font-black' : 'text-white'}>CONTRATANTE:</strong>{' '}
              {client.companyName.toUpperCase()}, representada neste ato por {client.responsibleName}, e-mail{' '}
              {client.email}.
            </p>
          </div>

          {/* Clause 1: Object & Scope */}
          <div>
            <h4 className={`text-sm font-bold mb-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Cláusula 1ª — Do Objeto e Escopo de Atuação
            </h4>
            <p className={`text-xs mb-3 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              O presente contrato tem como objeto a prestação especializada de serviços de gestão de tráfego pago,
              engenharia de atribuição e otimização de conversão pela CONTRATADA em benefício da CONTRATANTE,
              englobando especificamente:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs ml-2">
              {client.scope.map((item, idx) => (
                <li key={idx}>
                  <span className={`font-semibold ${isLight ? 'text-slate-950' : 'text-white'}`}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clause 2: Transparency & Tracking */}
          <div>
            <h4 className={`text-sm font-bold mb-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Cláusula 2ª — Da Transparência Radical e Propriedade de Dados
            </h4>
            <p className={`text-xs ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              Todas as contas de anúncios (Meta Ads Business Manager, Google Ads), pixels, servidores de Conversions API
              (CAPI) e relatórios no Looker Studio são e permanecerão de titularidade exclusiva da CONTRATANTE. A
              CONTRATADA compromete-se a manter atualizado o Portal do Cliente com o histórico quinzenal e métricas de
              desempenho.
            </p>
          </div>

          {/* Clause 3: Term & Renewal */}
          <div>
            <h4 className={`text-sm font-bold mb-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Cláusula 3ª — Da Vigência e Renovação
            </h4>
            <p className={`text-xs ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              O presente instrumento vigora desde{' '}
              <span className={`font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>{client.contractStart}</span> até{' '}
              <span className={`font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>{client.contractRenewal}</span>{' '}
              ({client.contractStatus}), renovando-se automaticamente por períodos de 12 (doze) meses caso não haja
              manifestação expressa em contrário.
            </p>
          </div>

          {/* Digital Signature Verification Block */}
          <div className={`pt-4 border-t ${isLight ? 'border-slate-300' : 'border-white/10'}`}>
            <div
              className={`p-4 rounded-xl border ${
                isLight
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-emerald-950/20 border-emerald-500/30'
              }`}
            >
              <div
                className={`flex items-center gap-2 font-bold text-xs mb-2 ${
                  isLight ? 'text-emerald-900' : 'text-emerald-400'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Assinatura Digital Válida ICP-Brasil e Clicksign</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className={`block font-medium ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    Assinado digitalmente por:
                  </span>
                  <span className={`font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    {client.responsibleName}
                  </span>
                  <span
                    className={`text-[11px] block font-mono ${isLight ? 'text-slate-700 font-semibold' : 'text-slate-400'}`}
                  >
                    IP: 177.136.21.90 · Autenticado via Token
                  </span>
                </div>
                <div>
                  <span className={`block font-medium ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    Pela Contratada:
                  </span>
                  <span className={`font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    Diretoria de Operações Upsell
                  </span>
                  <span
                    className={`text-[11px] block font-mono ${isLight ? 'text-slate-700 font-semibold' : 'text-slate-400'}`}
                  >
                    Hash SHA-256: e8b94f...99a2c4
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t ${
            isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900/40 border-white/10'
          }`}
        >
          <span className={`text-xs flex items-center gap-1.5 font-medium ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            Documento com validade jurídica plena e arquivado na nuvem
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handlePrint}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                isLight
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-transparent'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#ed1c24] hover:bg-[#c8141b] text-white transition-colors shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Contrato</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
