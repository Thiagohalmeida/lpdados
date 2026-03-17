# 📊 Estrutura da Plataforma BI - Control F5

## Hierarquia de Dados

```
┌─────────────────────────────────────────────────────────┐
│                       PROJETO                           │
│  - Nome, Descrição, Área                                │
│  - STATUS (Em Desenvolvimento/Entregue/Standby) ✅      │
│  - Tecnologias                                          │
│  - Data, Link, Docs                                     │
│  + CAMPOS DE GESTÃO:                                    │
│    • data_inicio                                        │
│    • ultima_atualizacao                                 │
│    • responsavel (Thiago/Leandro)                       │
│    • cliente (Interno/Externo)                          │
│    • observacao                                         │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┬──────────────┐
        │                 │                 │              │
        ▼                 ▼                 ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  DASHBOARD   │  │     DOCS     │  │  FERRAMENTA  │  │   PESQUISA   │
│              │  │              │  │              │  │              │
│ (Produto)    │  │ (Produto)    │  │ (Produto)    │  │ (Produto)    │
│ SEM status   │  │ SEM status   │  │ SEM status   │  │ SEM status   │
│              │  │              │  │              │  │              │
│ + Campos de  │  │ + Campos de  │  │ + Campos de  │  │ + Campos de  │
│   Gestão     │  │   Gestão     │  │   Gestão     │  │   Gestão     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

## Lógica de Negócio

### PROJETOS (Iniciativas)
- **Tem ciclo de vida**: Em Desenvolvimento → Entregue
- **Tem status visível**: Badge colorido no card
- **Exemplo**: "Projeto Dashboard de Tráfego"
- **Objetivo**: Executivo acompanha o andamento

### PRODUTOS (Entregas)
- **São resultados finais**: Dashboard, Doc, Ferramenta, Pesquisa
- **Não tem status**: Ou está disponível ou não está
- **Exemplo**: "Dashboard de Tráfego" (produto do projeto)
- **Objetivo**: Usuário acessa e utiliza

## Campos de Gestão (Todos têm)

Tanto projetos quanto produtos têm campos de gestão para controle:

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `data_inicio` | DATE | Quando começou | 2024-01-15 |
| `ultima_atualizacao` | TIMESTAMP | Última modificação | 2024-02-09 10:30:00 |
| `responsavel` | STRING | Quem cuida | Thiago, Leandro |
| `cliente` | STRING | Tipo de cliente | Interno, Externo |
| `observacao` | STRING | Notas gerais | "Aguardando aprovação" |

## Visualização na Plataforma

### Aba Projetos
```
┌────────────────────────────────────┐
│ 🔵 Em Desenvolvimento              │  ← Badge de status
│                                    │
│ Dashboard de Tráfego               │
│ Projeto para criar dashboard...   │
│                                    │
│ 🏷️ Tráfego  💻 Looker, BigQuery   │
│                                    │
│ [Detalhes] [Visualizar]            │
└────────────────────────────────────┘
```

### Aba Dashboards
```
┌────────────────────────────────────┐
│                                    │  ← SEM badge de status
│ Dashboard de Tráfego               │
│ Visualização de métricas...        │
│                                    │
│ 🏷️ Tráfego                         │
│                                    │
│ [Detalhes] [Acessar]               │
└────────────────────────────────────┘
```

## Página de Detalhes (Fase 3)

Quando o executivo clicar em "Detalhes", verá:

### Projeto
- ✅ Status (badge colorido)
- ✅ Informações básicas
- ✅ Campos de gestão
- ✅ Tecnologias
- ✅ Links

### Dashboard/Doc/Ferramenta/Pesquisa
- ❌ Status (não tem)
- ✅ Informações básicas
- ✅ Campos de gestão
- ✅ Campos específicos
- ✅ Links

## Resumo

| Item | Status? | Campos Gestão? | Motivo |
|------|---------|----------------|--------|
| Projeto | ✅ Sim | ✅ Sim | Tem ciclo de vida |
| Dashboard | ❌ Não | ✅ Sim | Produto final |
| Documentação | ❌ Não | ✅ Sim | Produto final |
| Ferramenta | ❌ Não | ✅ Sim | Produto final |
| Pesquisa | ❌ Não | ✅ Sim | Produto final |

---

**Estrutura atual: ✅ CORRETA**

Pronto para implementar Fase 3: Páginas de Detalhes!
