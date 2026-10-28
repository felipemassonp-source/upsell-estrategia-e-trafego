import { ClientProfile } from './types';

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'clinica-bem-estar',
    companyName: 'Clínica Bem Estar',
    segment: 'Medicina Integrativa & Longevidade',
    responsibleName: 'Dra. Camila Nogueira',
    email: 'contato@clinicabemestar.com.br',
    contractStatus: 'Contrato Vigente - Renovação em Out/2026',
    contractStart: '15/10/2024',
    contractRenewal: '15/10/2026',
    scope: [
      'Gestão Estratégica de Tráfego Meta Ads (Instagram & Facebook)',
      'Gestão de Campanhas de Alta Intenção no Google Search & PMax',
      'Configuração Avançada de Tracking Server-Side (CAPI + GA4)',
      'Otimização de Taxa de Agendamento no WhatsApp'
    ],
    activeChannels: ['Meta Ads (Reels & Carrosséis)', 'Google Search (Fundo de Funil)', 'Google PMax', 'Tracking CAPI'],
    currentFocus: 'Escala controlada de criativos em formato Reels com foco em consultas particulares de medicina integrativa e implantação de público semelhante (LAL) qualificado de pacientes que compareceram à clínica nos últimos 180 dias. Redução do tempo de resposta no WhatsApp com pré-qualificação.',
    nextSteps: 'Ativação da campanha de Google Ads com palavras-chave de sintomas e tratamentos de alta margem (longevidade celular e reposição hormonal) e validação do teste A/B da landing page com nova prova social em vídeo.',
    metrics: {
      investment: 14850.00,
      leads: 582,
      cpl: 25.51,
      roas: 5.64,
      revenue: 83750.00,
      growth: {
        investment: '+12.4%',
        leads: '+28.6%',
        cpl: '-14.2%',
        roas: '+0.8x'
      }
    },
    links: {
      lookerStudio: 'https://lookerstudio.google.com/reporting/demo-upsell-bem-estar',
      financialSheet: 'https://docs.google.com/spreadsheets/d/demo-upsell-financeiro',
      googleDrive: 'https://drive.google.com/drive/folders/demo-upsell-criativos-aprovados',
      contractPdf: 'https://upsell.app/contratos/upsell-clinica-bem-estar-assinado.pdf',
      creativeCopies: 'https://drive.google.com/drive/folders/demo-upsell-copys-e-roteiros',
      creativeVideos: 'https://drive.google.com/drive/folders/demo-upsell-criativos-video-reels',
      creativeImages: 'https://drive.google.com/drive/folders/demo-upsell-criativos-imagens-banners'
    },
    accessPin: '839102',
    operationMessages: [
      {
        id: 'msg-1',
        sender: 'gestor',
        authorName: 'Felipe Masson · Gestor UpSell',
        text: 'Iniciamos a quinzena com foco total na escala de criativos em formato Reels para medicina integrativa. O público LAL 180D de pacientes gerou uma queda de 14.2% no CPL!',
        date: '10/10/2026',
        time: '09:30',
        tag: 'Atualização de Campanhas'
      },
      {
        id: 'msg-2',
        sender: 'client',
        authorName: 'Dra. Camila Nogueira',
        text: 'Excelente! A recepção confirmou que os pacientes dessa semana chegaram muito mais qualificados para as consultas particulares.',
        date: '11/10/2026',
        time: '14:15',
        tag: 'Alinhamento'
      },
      {
        id: 'msg-3',
        sender: 'gestor',
        authorName: 'Felipe Masson · Gestor UpSell',
        text: 'Ótimo retorno, Dra. Camila! Para os próximos dias, ativamos a nova campanha de Google Ads com palavras-chave de sintomas e tratamentos de alta margem (longevidade celular). Os roteiros dos novos vídeos já foram organizados na pasta de Copys & Roteiros.',
        date: '14/10/2026',
        time: '16:45',
        tag: 'Parecer Estratégico'
      },
      {
        id: 'msg-4',
        sender: 'gestor',
        authorName: 'Felipe Masson · Gestor UpSell',
        text: 'Relatório quinzenal atualizado na seção de Análise de Resultados. O volume de leads atingiu 582 contatos com ROAS consolidado de 5.64x.',
        date: 'Hoje',
        time: '11:20',
        tag: 'Entrega'
      }
    ],
    actionItems: [
      {
        id: 'task-agency-1',
        task: 'Otimização de Públicos LAL 180D & Escala de Criativos em Vídeo',
        detail: 'Revisar métricas de frequência, pausar criativos saturados e ativar 2 novos ângulos de copywriting para medicina integrativa.',
        status: 'in_progress',
        due: 'Até amanhã',
        assignee: 'agency',
        priority: 'high',
        category: 'Tráfego Meta Ads'
      },
      {
        id: 'task-1',
        task: 'Gravação dos 2 vídeos de respostas a dúvidas frequentes',
        detail: 'Roteiros enviados pelo gestor no WhatsApp no dia 12/10. Duração de 45 a 60 segundos com a Dra. Camila.',
        status: 'pending',
        due: 'Até 22/10',
        assignee: 'client',
        priority: 'high',
        category: 'Criativos & Vídeos'
      },
      {
        id: 'task-agency-2',
        task: 'Auditoria de Conversão da Nova Landing Page & Teste A/B de Prova Social',
        detail: 'Subir variação de página com novo bloco de depoimentos e verificar disparos do pixel de agendamento.',
        status: 'review',
        due: 'Até 20/10',
        assignee: 'agency',
        priority: 'medium',
        category: 'Tracking & CRO'
      },
      {
        id: 'task-2',
        task: 'Envio de 5 fotos em alta resolução da nova sala de atendimento',
        detail: 'Material para os novos criativos estáticos de prova institucional da clínica.',
        status: 'completed',
        due: 'Concluído em 10/10',
        assignee: 'client',
        priority: 'medium',
        category: 'Criativos & Mídia'
      },
      {
        id: 'task-agency-3',
        task: 'Configuração da Conversions API (CAPI) Cloudflare com nota de qualidade 9.4',
        detail: 'Implementação de servidor edge para envio de dados sem perda por bloqueadores iOS.',
        status: 'completed',
        due: 'Concluído em 06/10',
        assignee: 'agency',
        priority: 'high',
        category: 'Tracking & Pixel'
      },
      {
        id: 'task-3',
        task: 'Validação da lista de contatos que fecharam consulta no último mês',
        detail: 'Para alimentar o público de conversão e exclusão no Meta Ads.',
        status: 'completed',
        due: 'Concluído em 05/10',
        assignee: 'client',
        priority: 'low',
        category: 'Base de Dados'
      }
    ],
    activeTools: [
      {
        id: 'tool-hospedagem',
        name: 'Hospedagem do Site (Hostinger Cloud)',
        category: 'Hospedagem & Servidor',
        accountEmail: 'contato@clinicabemestar.com.br',
        loginUser: 'adm_bemestar',
        password: 'Host@BemEstar#2026',
        accessUrl: 'https://hpanel.hostinger.com',
        status: 'Ativo / Vinculado',
        detail: 'Servidor Cloud Startup, PHP 8.3 e LiteSpeed Cache configurado para alta conversão'
      },
      {
        id: 'tool-dominio',
        name: 'Registro de Domínio & DNS (Registro.br)',
        category: 'Domínio & DNS',
        accountEmail: 'financeiro@clinicabemestar.com.br',
        loginUser: 'CNOGUEIRA-SP',
        password: 'RegBr!Clinica2026',
        accessUrl: 'https://registro.br',
        status: 'Ativo / Vinculado',
        detail: 'Domínio clinicabemestar.com.br com DNS delegado para Cloudflare'
      },
      {
        id: 'tool-1',
        name: 'Meta Business Manager',
        category: 'Instagram & Facebook Ads',
        accountEmail: 'contato@clinicabemestar.com.br',
        loginUser: 'bm.clinicabemestar',
        password: 'Meta@Upsell2026#',
        accessUrl: 'https://business.facebook.com',
        status: 'Ativo / Vinculado',
        detail: 'Pixel e CAPI Cloudflare operando com nota de qualidade 9.4/10'
      },
      {
        id: 'tool-2',
        name: 'Google Ads (MCC Upsell)',
        category: 'Rede de Pesquisa & PMax',
        accountEmail: 'contato@clinicabemestar.com.br',
        loginUser: 'CID: 832-441-9021',
        password: 'Acesso Direto MCC Upsell',
        accessUrl: 'https://ads.google.com',
        status: 'Ativo / Vinculado',
        detail: 'Termos negativos e faturamento direto com o cliente'
      },
      {
        id: 'tool-3',
        name: 'Google Analytics 4 & Tag Manager',
        category: 'Métricas & Web',
        accountEmail: 'contato@clinicabemestar.com.br',
        loginUser: 'GTM-W8B291X',
        password: 'GTM_Analitica!2026',
        accessUrl: 'https://tagmanager.google.com',
        status: 'Ativo / Vinculado',
        detail: 'Eventos de clique e permanência sincronizados via dataLayer'
      },
      {
        id: 'tool-4',
        name: 'WhatsApp Business API (Z-API)',
        category: 'Comunicação & CRM',
        accountEmail: 'atendimento@clinicabemestar.com.br',
        loginUser: 'instancia_clinica_01',
        password: 'ZapiToken#9928374',
        accessUrl: 'https://admin.z-api.io',
        status: 'Ativo / Vinculado',
        detail: 'Mensagens pré-configuradas e rastreadas com tags UTM'
      }
    ],
    weeklyHistory: [
      { week: 'Sem 01', investment: 3200, revenue: 16800, leads: 124, cpl: 25.80 },
      { week: 'Sem 02', investment: 3650, revenue: 19400, leads: 146, cpl: 25.00 },
      { week: 'Sem 03', investment: 3800, revenue: 22100, leads: 151, cpl: 25.16 },
      { week: 'Sem 04', investment: 4200, revenue: 25450, leads: 161, cpl: 26.08 }
    ],
    optimizationLogs: [
      {
        id: 'opt-1',
        date: '14/10/2026',
        channel: 'Meta Ads',
        action: 'Desativação de 3 criativos fadigados e inserção de 2 novos vídeos verticais da Dra. Camila explicando o protocolo de reposição.',
        expectedImpact: 'Queda estimada de 10% no CPL nas próximas 72 horas e elevação da taxa de comparecimento.',
        status: 'Em Teste'
      },
      {
        id: 'opt-2',
        date: '10/10/2026',
        channel: 'Google Ads',
        action: 'Inclusão de 47 palavras-chave negativas identificadas no relatório de termos de pesquisa (ex: "grátis", "SUS", "convênio Unimed").',
        expectedImpact: 'Eliminação de cliques desqualificados e redução de 18% no desperdício de verba.',
        status: 'Concluído'
      },
      {
        id: 'opt-3',
        date: '06/10/2026',
        channel: 'Tracking & CAPI',
        action: 'Auditoria e revalidação do token da Conversions API (CAPI) via servidor Cloudflare. Eventos de Lead e WhatsApp com nota de qualidade 9.4/10.',
        expectedImpact: 'Algoritmo da Meta recebendo 99.2% dos dados de conversão sem perda por bloqueadores iOS.',
        status: 'Concluído'
      },
      {
        id: 'opt-4',
        date: '02/10/2026',
        channel: 'Criativos & LP',
        action: 'Refatoração da chamada para ação (CTA) na página de captura: substituição de formulário longo por botão direto com mensagem personalizada.',
        expectedImpact: 'Aumento imediato de 3.2% para 4.8% na taxa de conversão da landing page.',
        status: 'Concluído'
      }
    ]
  },
  {
    id: 'instituto-odontologico-prime',
    companyName: 'Instituto Odontológico Prime',
    segment: 'Implantodontia & Reabilitação Oral de Alto Padrão',
    responsibleName: 'Dr. Roberto Silveira',
    email: 'gestao@institutoprime.com.br',
    contractStatus: 'Contrato Vigente - Renovação em Nov/2026',
    contractStart: '01/11/2024',
    contractRenewal: '01/11/2026',
    scope: [
      'Campanhas Meta Ads focadas em Implantes Carga Imediata e Lentes de Contato',
      'Google Search Fundo de Funil para termos odontológicos premium',
      'Setup de Dashboard em Tempo Real no Looker Studio',
      'Treinamento da recepção para atendimento dos leads de tráfego'
    ],
    activeChannels: ['Meta Ads (Feed e Stories)', 'Google Search', 'Tracking CAPI'],
    currentFocus: 'Foco na geração de agendamentos de avaliação para o protocolo de implantes totais (ticket médio R$ 18.000). Segmentação em raio geográfico nobre (5km) e refinamento de exclusão por renda.',
    nextSteps: 'Gravação de novo lote de vídeos de depoimentos com pacientes e ativação da campanha de remarketing intensivo para quem acessou a página de implantes sem falar no WhatsApp.',
    metrics: {
      investment: 21500.00,
      leads: 394,
      cpl: 54.56,
      roas: 7.20,
      revenue: 154800.00,
      growth: {
        investment: '+15.0%',
        leads: '+19.2%',
        cpl: '-6.4%',
        roas: '+1.1x'
      }
    },
    links: {
      lookerStudio: 'https://lookerstudio.google.com/reporting/demo-upsell-prime',
      financialSheet: 'https://docs.google.com/spreadsheets/d/demo-upsell-prime-financeiro',
      googleDrive: 'https://drive.google.com/drive/folders/demo-upsell-prime-criativos',
      contractPdf: 'https://upsell.app/contratos/upsell-instituto-prime-assinado.pdf',
      creativeCopies: 'https://drive.google.com/drive/folders/demo-upsell-prime-copys',
      creativeVideos: 'https://drive.google.com/drive/folders/demo-upsell-prime-videos',
      creativeImages: 'https://drive.google.com/drive/folders/demo-upsell-prime-imagens'
    },
    accessPin: '642918',
    operationMessages: [
      {
        id: 'msg-p1',
        sender: 'gestor',
        authorName: 'Felipe Masson · Gestor UpSell',
        text: 'Campanha de implantes dentários com foco em pacientes classe A/B ativada com sucesso. Copys ajustadas para destacar conforto e tecnologia guiada por computador.',
        date: '12/10/2026',
        time: '10:00',
        tag: 'Atualização de Campanhas'
      },
      {
        id: 'msg-p2',
        sender: 'gestor',
        authorName: 'Felipe Masson · Gestor UpSell',
        text: 'Novos criativos de vídeo gravados na clínica foram adicionados à pasta de Vídeos e já estão rodando no Meta Ads.',
        date: 'Hoje',
        time: '08:45',
        tag: 'Entrega'
      }
    ],
    actionItems: [
      {
        id: 'task-p1',
        task: 'Gravação de depoimento em vídeo com paciente de implante total',
        detail: 'Roteiro e briefing de iluminação fornecido pela Upsell. Duração ~50 segundos.',
        status: 'pending',
        due: 'Até 24/10'
      },
      {
        id: 'task-p2',
        task: 'Ajuste de alçada de resposta da secretária para leads no WhatsApp',
        detail: 'Implementação do script comercial para reduzir tempo de resposta de 45m para 5m.',
        status: 'completed',
        due: 'Concluído em 11/10'
      }
    ],
    activeTools: [
      {
        id: 'tool-prime-hosp',
        name: 'Hospedagem & CMS (Cloudways / WordPress)',
        category: 'Hospedagem & Servidor',
        accountEmail: 'admin@institutoprime.com.br',
        loginUser: 'prime_wp_admin',
        password: 'Prime#WpSecure2026',
        accessUrl: 'https://institutoprime.com.br/wp-admin',
        status: 'Ativo / Vinculado',
        detail: 'Servidor DigitalOcean dedicado, WP Rocket e Cloudflare Enterprise ativo'
      },
      {
        id: 'tool-prime-dom',
        name: 'Domínio & DNS (Cloudflare DNS)',
        category: 'Domínio & DNS',
        accountEmail: 'gestao@institutoprime.com.br',
        loginUser: 'roberto@institutoprime.com.br',
        password: 'Cloudflare!Prime99',
        accessUrl: 'https://dash.cloudflare.com',
        status: 'Ativo / Vinculado',
        detail: 'Proxy SSL ativo com proteção contra ataques e CAPI Gateway configurado'
      },
      {
        id: 'tool-prime-meta',
        name: 'Meta Business Manager',
        category: 'Instagram & Facebook Ads',
        accountEmail: 'gestao@institutoprime.com.br',
        loginUser: 'bm_instituto_prime',
        password: 'Meta#PrimeAds2026',
        accessUrl: 'https://business.facebook.com',
        status: 'Ativo / Vinculado',
        detail: 'Campanhas de implantes dentários com CAPI server-side'
      },
      {
        id: 'tool-prime-google',
        name: 'Google Ads (MCC Upsell)',
        category: 'Rede de Pesquisa & PMax',
        accountEmail: 'gestao@institutoprime.com.br',
        loginUser: 'CID: 412-990-2811',
        password: 'Acesso MCC Direto',
        accessUrl: 'https://ads.google.com',
        status: 'Ativo / Vinculado',
        detail: 'Palavras de alta intenção com extensão de chamada direta'
      }
    ],
    weeklyHistory: [
      { week: 'Sem 01', investment: 4800, revenue: 32000, leads: 90, cpl: 53.30 },
      { week: 'Sem 02', investment: 5200, revenue: 38400, leads: 96, cpl: 54.16 },
      { week: 'Sem 03', investment: 5500, revenue: 41200, leads: 101, cpl: 54.45 },
      { week: 'Sem 04', investment: 6000, revenue: 43200, leads: 107, cpl: 56.07 }
    ],
    optimizationLogs: [
      {
        id: 'opt-p1',
        date: '13/10/2026',
        channel: 'Meta Ads',
        action: 'Segmentação ajustada para público acima de 42 anos com interesse comprovado em saúde e reabilitação.',
        expectedImpact: 'Aumento na taxa de fechamento de contratos de implantes no consultório.',
        status: 'Em Teste'
      },
      {
        id: 'opt-p2',
        date: '08/10/2026',
        channel: 'Google Ads',
        action: 'Criação de novos anúncios responsivos com extensões de chamada direta e localização do consultório.',
        expectedImpact: 'Taxa de cliques (CTR) subiu de 4.1% para 6.7%.',
        status: 'Concluído'
      }
    ]
  },
  {
    id: 'dermacare-estetica',
    companyName: 'Dermacare Estética Avançada',
    segment: 'Dermatologia Clínica & Procedimentos a Laser',
    responsibleName: 'Dra. Vanessa Martins',
    email: 'vanessa@dermacareclinica.com.br',
    contractStatus: 'Contrato Vigente - Renovação em Jan/2027',
    contractStart: '15/01/2025',
    contractRenewal: '15/01/2027',
    scope: [
      'Meta Ads focado em Bioestimuladores de Colágeno e Harmonização Facial',
      'Google Search institucional e tratamentos corporais',
      'Relatórios semanais de taxa de conversão comercial'
    ],
    activeChannels: ['Meta Ads (Vídeos e Carrosséis)', 'Google Search'],
    currentFocus: 'Campanha temática de Primavera para protocolos de harmonização e bioestimuladores de colágeno. Testando novos formatos de criativos com antes/depois educativo em conformidade com as regras do CFM.',
    nextSteps: 'Preparar a campanha da Black Friday Médica de pacotes de laser e peelings para novembro.',
    metrics: {
      investment: 11200.00,
      leads: 488,
      cpl: 22.95,
      roas: 4.90,
      revenue: 54880.00,
      growth: {
        investment: '+8.0%',
        leads: '+24.1%',
        cpl: '-11.5%',
        roas: '+0.5x'
      }
    },
    links: {
      lookerStudio: 'https://lookerstudio.google.com/reporting/demo-upsell-dermacare',
      financialSheet: 'https://docs.google.com/spreadsheets/d/demo-upsell-dermacare-financeiro',
      googleDrive: 'https://drive.google.com/drive/folders/demo-upsell-dermacare-criativos',
      contractPdf: 'https://upsell.app/contratos/upsell-dermacare-assinado.pdf',
      creativeCopies: 'https://drive.google.com/drive/folders/demo-upsell-dermacare-copys',
      creativeVideos: 'https://drive.google.com/drive/folders/demo-upsell-dermacare-videos',
      creativeImages: 'https://drive.google.com/drive/folders/demo-upsell-dermacare-imagens'
    },
    accessPin: '517390',
    operationMessages: [
      {
        id: 'msg-d1',
        sender: 'gestor',
        authorName: 'Felipe Masson · Gestor UpSell',
        text: 'Campanha de Primavera no ar com criativos educativos para bioestimuladores de colágeno. Foco na captação de pacientes para pacotes de estética médica.',
        date: '08/10/2026',
        time: '11:15',
        tag: 'Atualização de Campanhas'
      },
      {
        id: 'msg-d2',
        sender: 'gestor',
        authorName: 'Felipe Masson · Gestor UpSell',
        text: 'Análise de resultados consolidada no Looker. Custo por lead em R$ 22,95, abaixo da meta estipulada.',
        date: 'Ontem',
        time: '17:30',
        tag: 'Entrega'
      }
    ],
    actionItems: [
      {
        id: 'task-d1',
        task: 'Seleção dos 6 melhores casos de harmonização facial (fotos antes/depois)',
        detail: 'Imagens com autorização assinada de uso de imagem dos pacientes.',
        status: 'pending',
        due: 'Até 25/10'
      },
      {
        id: 'task-d2',
        task: 'Aprovação da verba extra para a Black Friday de Harmonização',
        detail: 'Incremento de R$ 3.000 para a última quinzena de novembro.',
        status: 'completed',
        due: 'Concluído em 09/10'
      }
    ],
    activeTools: [
      {
        id: 'tool-derma-hosp',
        name: 'Hospedagem da Landing Page (Vercel & Next.js)',
        category: 'Hospedagem & Servidor',
        accountEmail: 'vanessa@dermacareclinica.com.br',
        loginUser: 'dermacare_admin',
        password: 'Vercel#Derma2026!',
        accessUrl: 'https://vercel.com/dermacare-team',
        status: 'Ativo / Vinculado',
        detail: 'Deploy automatizado, edge caching e velocidade Core Web Vitals 99/100'
      },
      {
        id: 'tool-derma-dom',
        name: 'Gestão de Domínio (Locaweb / Registro)',
        category: 'Domínio & DNS',
        accountEmail: 'financeiro@dermacareclinica.com.br',
        loginUser: 'DERMACARE-SC',
        password: 'Dom!DermaSC2026',
        accessUrl: 'https://painel.locaweb.com.br',
        status: 'Ativo / Vinculado',
        detail: 'Domínio institucional dermacareclinica.com.br renovado até 2028'
      },
      {
        id: 'tool-derma-meta',
        name: 'Meta Business Manager',
        category: 'Instagram & Facebook Ads',
        accountEmail: 'vanessa@dermacareclinica.com.br',
        loginUser: 'bm.dermacare.estetica',
        password: 'Meta#LaserDerma26',
        accessUrl: 'https://business.facebook.com',
        status: 'Ativo / Vinculado',
        detail: 'Contas do Instagram e WhatsApp vinculadas ao Pixel'
      },
      {
        id: 'tool-derma-crm',
        name: 'CRM & Agenda Médica (Doctoralia / Clinicorp)',
        category: 'Comunicação & CRM',
        accountEmail: 'recepcao@dermacareclinica.com.br',
        loginUser: 'recepcao_dermacare',
        password: 'ClinicaCorp@2026',
        accessUrl: 'https://app.clinicorp.com',
        status: 'Ativo / Vinculado',
        detail: 'Recebimento automático dos contatos gerados via Meta Ads'
      }
    ],
    weeklyHistory: [
      { week: 'Sem 01', investment: 2600, revenue: 12200, leads: 112, cpl: 23.21 },
      { week: 'Sem 02', investment: 2750, revenue: 13500, leads: 120, cpl: 22.91 },
      { week: 'Sem 03', investment: 2850, revenue: 14100, leads: 125, cpl: 22.80 },
      { week: 'Sem 04', investment: 3000, revenue: 15080, leads: 131, cpl: 22.90 }
    ],
    optimizationLogs: [
      {
        id: 'opt-d1',
        date: '12/10/2026',
        channel: 'Meta Ads',
        action: 'Lançamento de criativo em carrossel explicando a ciência por trás do bioestimulador com chamada para consulta.',
        expectedImpact: 'Geração média de 16 novos contatos diários qualificados.',
        status: 'Concluído'
      }
    ]
  }
];
