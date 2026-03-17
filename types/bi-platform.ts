// types/bi-platform.ts
// Tipos padronizados para a plataforma de BI

/**
 * Status possíveis para projetos
 */
export type StatusProjeto = 'entregue' | 'em desenvolvimento' | 'standby';

/**
 * Campos comuns de gestão para todos os itens
 */
export interface CamposGestao {
  data_inicio?: string;
  ultima_atualizacao?: string;
  responsavel?: 'Thiago' | 'Leandro' | null;
  cliente?: 'Interno' | 'Externo' | null;
  observacao?: string;
}

/**
 * Projeto de BI
 */
export interface Projeto extends CamposGestao {
  id: string;
  nome: string;
  descricao: string;
  status: StatusProjeto;
  data: string;
  link?: string;
  docs?: string;
  area: string;
  tecnologias: string[];
}

/**
 * Dashboard
 */
export interface Dashboard extends CamposGestao {
  id: string;
  nome: string;
  descricao: string;
  link: string;
  area: string;
}

/**
 * Documentação
 */
export interface Documentacao extends CamposGestao {
  id: string;
  nome: string;
  descricao: string;
  link: string;
  area: string;
}

/**
 * Ferramenta
 */
export interface Ferramenta extends CamposGestao {
  id: string;
  nome: string;
  descricao: string;
  link: string;
  proxima_atualizacao?: string;
}

/**
 * Pesquisa
 */
export interface Pesquisa extends CamposGestao {
  id: string;
  titulo: string;
  fonte: string;
  link?: string;
  data: string;
  conteudo: string;
  tema: string;
}

export type StatusDemanda =
  | 'nova'
  | 'em analise'
  | 'em desenvolvimento'
  | 'entregue'
  | 'cancelada';

export type PrioridadeDemanda = 'baixa' | 'media' | 'alta' | 'urgente';

export interface Demanda {
  id: string;
  titulo: string;
  descricao: string;
  area: string;
  solicitante: string;
  email?: string;
  tipo?: string;
  prioridade: PrioridadeDemanda;
  status: StatusDemanda;
  projeto_id?: string | null;
  data_abertura: string;
  data_atualizacao?: string;
  observacao?: string;
}

export type StatusTabela = 'ok' | 'alerta' | 'atrasado';

export interface TabelaStatus {
  id: string;
  dataset_name?: string;
  table_name?: string;
  nome_tabela: string;
  descricao?: string;
  ultima_atualizacao?: string;
  proxima_atualizacao?: string;
  status: StatusTabela;
  impacto?: string;
  responsavel?: string;
  fonte?: string;
  observacao?: string;
  ativo_portal?: boolean;
}

export interface TabelaBigQueryCatalogo {
  dataset_name: string;
  table_name: string;
  last_updated?: string;
}

export interface TabelasStatusResponse {
  items: TabelaStatus[];
  fetchedAt: string;
  lastRealUpdate?: string;
}

/**
 * Filtros para projetos
 */
export interface FiltrosProjeto {
  busca?: string;
  status?: StatusProjeto | 'todos';
  area?: string;
}

/**
 * Filtros gerais (dashboards, docs, etc)
 */
export interface FiltrosGerais {
  busca?: string;
  area?: string;
}

/**
 * Resultado de busca unificada
 */
export interface ResultadoBusca {
  tipo: 'projeto' | 'dashboard' | 'doc' | 'ferramenta' | 'pesquisa' | 'demanda' | 'tabela-status';
  item: Projeto | Dashboard | Documentacao | Ferramenta | Pesquisa | Demanda | TabelaStatus;
  score: number;
}

/**
 * Resposta de erro da API
 */
export interface ApiError {
  error: string;
  message?: string;
}
