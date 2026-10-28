export type UserRole = 'guest' | 'client' | 'admin';
export type VisualTheme = 'light' | 'dark';

export interface WeeklyDataPoint {
  week: string;
  investment: number;
  revenue: number;
  leads: number;
  cpl: number;
}

export interface OptimizationLog {
  id: string;
  date: string;
  channel: 'Meta Ads' | 'Google Ads' | 'Tracking & CAPI' | 'Criativos & LP';
  action: string;
  expectedImpact: string;
  status: 'Concluído' | 'Em Teste' | 'Monitorando';
}

export interface ClientLinks {
  lookerStudio: string; // Análise de Resultados (Looker Studio)
  financialSheet?: string;
  googleDrive?: string; // Repositório Geral Drive
  contractPdf: string; // Contrato Oficial
  creativeCopies?: string; // Pasta de Copys & Roteiros
  creativeVideos?: string; // Pasta de Criativos em Vídeo
  creativeImages?: string; // Pasta de Criativos em Imagem
}

export type OperationMessageTag = 'Parecer Estratégico' | 'Atualização de Campanhas' | 'Alinhamento' | 'Entrega';

export interface OperationMessage {
  id: string;
  sender: 'gestor' | 'client';
  authorName: string;
  text: string;
  date: string;
  time: string;
  tag?: OperationMessageTag;
}

export interface ClientMetrics {
  investment: number;
  leads: number;
  cpl: number;
  roas: number;
  revenue: number;
  growth: {
    investment: string;
    leads: string;
    cpl: string;
    roas: string;
  };
}

export type TaskStatus = 'pending' | 'in_progress' | 'review' | 'completed';
export type TaskAssignee = 'agency' | 'client';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface ClientActionItem {
  id: string;
  task: string;
  detail: string;
  status: TaskStatus;
  due: string;
  assignee?: TaskAssignee; // 'agency' = UpSell / Gestor | 'client' = Cliente
  priority?: TaskPriority; // 'high' | 'medium' | 'low'
  category?: string;
}

export interface ClientToolAccess {
  id: string;
  name: string;
  category: string;
  accountEmail: string;
  loginUser?: string;
  password?: string;
  accessUrl?: string;
  status: 'Ativo / Vinculado' | 'Pendente de Acesso' | 'Em Configuração';
  detail: string;
}

export interface ClientProfile {
  id: string;
  companyName: string;
  segment: string;
  responsibleName: string;
  email: string;
  contractStatus: string;
  contractStart: string;
  contractRenewal: string;
  scope: string[];
  activeChannels: string[];
  currentFocus: string;
  nextSteps: string;
  metrics: ClientMetrics;
  links: ClientLinks;
  accessPin?: string; // Senha ou PIN de 6 dígitos para acesso seguro do cliente
  pinUpdatedAt?: string; // Data da última atualização ou redefinição da chave
  pinResetRequested?: boolean; // Flag se o cliente solicitou redefinição
  pinResetRequestedAt?: string; // Data/hora da solicitação de recuperação
  actionItems?: ClientActionItem[];
  activeTools?: ClientToolAccess[];
  operationMessages?: OperationMessage[]; // Feed de mensagens e pareceres da operação estilo conversa
  weeklyHistory: WeeklyDataPoint[];
  optimizationLogs: OptimizationLog[];
}
