import {
  BarChart3,
  BookOpen,
  FileJson,
  FolderKanban,
  type LucideIcon,
  HeartPulse,
  Home,
  LayoutGrid,
  PlusSquare,
} from "lucide-react";

export const platformRoutes = {
  home: "/",
  portal: "/portal",
  help: "/central-ajuda",
  admin: "/admin",
  newRequest: "/solicitacoes/nova",
  health: "/#saude-dos-dados",
  dataExplorer: "https://portal-bi-controlf5.vercel.app/",
  adminRequests: "/admin/demandas",
  adminHealth: "/admin/saude-dados",
} as const;

export const publicEntryPoints = [
  {
    href: platformRoutes.portal,
    label: "Entrar no Portal",
    description: "Acesso ao hub principal de conteudos e modulos de BI.",
  },
  {
    href: platformRoutes.newRequest,
    label: "Nova solicitacao",
    description: "Canal publico para abertura de novas demandas de BI.",
  },
  {
    href: platformRoutes.help,
    label: "Central de Ajuda",
    description: "Orientacoes de uso, modulos e fluxos principais.",
  },
] as const;

export const portalTabs = [
  { value: "projetos", label: "Projetos" },
  { value: "dashboards", label: "Dashboards" },
  { value: "documentacao", label: "Documentacao" },
  { value: "ferramentas", label: "Ferramentas" },
  { value: "pesquisas", label: "Pesquisas" },
] as const;

type AdminSection = {
  title: string;
  description: string;
  href: string;
  color: string;
  bg: string;
  icon: LucideIcon;
};

export const adminSections: AdminSection[] = [
  {
    title: "Gerenciar Itens",
    description: "Gerenciar projetos, dashboards, documentacao e ferramentas",
    icon: FolderKanban,
    href: "/admin/projetos",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Pesquisas",
    description: "Gerenciar pesquisas",
    icon: BookOpen,
    href: "/admin/pesquisas",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    title: "Dicionario e Insights",
    description: "Importar JSON, normalizar e publicar docs por dashboard",
    icon: FileJson,
    href: "/admin/dashboard-docs",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    title: "Telemetria",
    description: "Acompanhar paginas mais acessadas e usuarios do portal",
    icon: BarChart3,
    href: "/admin/telemetria",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Gestao de demandas",
    description: "Espaco reservado para a futura operacao do fluxo de solicitacoes",
    icon: PlusSquare,
    href: platformRoutes.adminRequests,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Saude dos Dados",
    description: "Espaco reservado para o futuro acompanhamento operacional das tabelas",
    icon: HeartPulse,
    href: platformRoutes.adminHealth,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
];

export const quickAccessCards = [
  {
    title: "Portal",
    description: "Projetos, dashboards, documentacao, ferramentas e pesquisas.",
    href: platformRoutes.portal,
    icon: LayoutGrid,
  },
  {
    title: "Nova solicitacao",
    description: "Abertura guiada de uma nova necessidade para o time de BI.",
    href: platformRoutes.newRequest,
    icon: PlusSquare,
  },
  {
    title: "Admin",
    description: "Area de gestao da plataforma e dos conteudos.",
    href: platformRoutes.admin,
    icon: Home,
  },
] as const;
