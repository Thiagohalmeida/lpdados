# Portal BI - Control F5

![Control F5 Logo](./public/images/f5-logo.png)

## Descrição
Portal de Business Intelligence dinâmico, moderno e responsivo, desenvolvido em Next.js, integrado ao BigQuery, para centralizar projetos, dashboards, documentações, pesquisas e ferramentas da equipe de BI da Control F5.

## Tecnologias Utilizadas
- **Next.js** 15+
- **React** 19+
- **TypeScript**
- **Tailwind CSS**
- **SWR** (fetch dinâmico)
- **Lucide Icons**
- **Google BigQuery** (dados dinâmicos)

## Paleta de Cores (Control F5)
- Azul: `#5CA9F7`
- Roxo: `#B86DFB`
- Rosa: `#E05EFF`
- Amarelo: `#FFE066`
- Branco: `#FFFFFF`
- Cinza claro: `#F5F6FA`

> **Todas as cores do portal seguem exclusivamente a identidade visual do logo Control F5.**

## Instalação e Execução
```bash
# Instale as dependências
pnpm install

# Rode o projeto em modo desenvolvimento
pnpm dev

# Acesse em http://localhost:3000
```

## Configuração de Ambiente
- Certifique-se de configurar as credenciais do BigQuery (arquivo JSON) e endpoints das APIs em `/app/api/`.
- Ajuste variáveis de ambiente se necessário (exemplo: `.env.local`).

## Estrutura de Pastas
```
lpdados/
  app/           # Páginas e rotas Next.js
  components/    # Componentes reutilizáveis (cards, UI, etc)
  lib/           # Funções utilitárias e fetchers
  public/        # Imagens e assets estáticos
  styles/        # Estilos globais
```

## Funcionalidades
- Visualização dinâmica de projetos, dashboards, documentações, pesquisas e ferramentas
- Filtros por área, status e tema
- Cards com ícones, badges e cores padronizadas
- Responsividade total (desktop/mobile)
- Feedback visual (loaders, mensagens de vazio)
- Acessibilidade e contraste

## Como Contribuir
1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'feat: minha feature'`
4. Push para o fork: `git push origin minha-feature`
5. Abra um Pull Request

## Contato e Suporte
- Feedback: [thiago@controlf5.com.br](mailto:thiago@controlf5.com.br)
- Suporte técnico: Equipe Control F5

---

© 2024 Control F5 - Área de Business Intelligence 