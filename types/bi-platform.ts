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
  tipo: 'projeto' | 'dashboard' | 'doc' | 'ferramenta' | 'pesquisa';
  item: Projeto | Dashboard | Documentacao | Ferramenta | Pesquisa;
  score: number;
}

/**
 * Resposta de erro da API
 */
export interface ApiError {
  error: string;
  message?: string;
}
