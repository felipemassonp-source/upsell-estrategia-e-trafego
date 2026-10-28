import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UPSELL ✳ Tráfego Pago, Criação de Sites e Consultoria Comercial',
  description:
    'Tráfego pago (Meta Ads & Google Ads), criação de sites autorais orientados à conversão e consultoria comercial. Contratação por especialidade e acompanhamento em portal próprio.',
  openGraph: {
    title: 'UPSELL ✳ Ideias que movem, vendem e escalam negócios',
    description:
      'Tráfego pago, criação de sites e consultoria comercial. Escolha a frente que sua empresa precisa agora e acompanhe cada passo em um portal próprio.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UPSELL ✳ Tráfego Pago, Criação de Sites e Consultoria Comercial',
    description:
      'Tráfego pago, criação de sites e consultoria comercial. Contratação independente e portal do cliente.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body suppressHydrationWarning className="bg-[#f7f7f4] text-[#141414] min-h-screen selection:bg-[#ed1c24] selection:text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
