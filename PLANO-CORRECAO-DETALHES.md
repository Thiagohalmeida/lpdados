# Plano de Correção: Padronizar Botões "Ver Detalhes"

## 🎯 OBJETIVO

Padronizar TODOS os botões "Ver Detalhes" para usar **IDs únicos** ao invés de nomes normalizados, garantindo consistência e confiabilidade em todas as abas.

## 📋 ARQUIVOS A MODIFICAR

### Components (4 arquivos)
1. `components/ui/FerramentaCard.tsx`
2. `components/ui/DashboardCard.tsx`
3. `components/ui/DocCard.tsx`
4. `components/ui/CardItem.tsx` (verificar se existe e precisa de ID)

### Pages (1 arquivo)
5. `app/page.tsx` - Passar IDs para os cards

### Total: 5 arquivos

## 🔧 IMPLEMENTAÇÃO DETALHADA

### PASSO 1: Atualizar FerramentaCard.tsx

**Mudanças**:
1. Adicionar `id?: string` na interface
2. Usar `id` ao invés de nome normalizado para o link

```typescript
// ANTES
interface FerramentaCardProps {
  nome: string;
  descricao: string;
  link: string;
  proxAtualizacao?: string;
}

export default function FerramentaCard({ nome, descricao, link, proxAtualizacao }: FerramentaCardProps) {
  const detailsId = nome
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '') || '';

  return (
    // ...
    <Link href={`/ferramentas/${detailsId}`}>
```

```typescript
// DEPOIS
interface FerramentaCardProps {
  id?: string;  // ADICIONAR
  nome: string;
  descricao: string;
  link: string;
  proxAtualizacao?: string;
}

export default function FerramentaCard({ id, nome, descricao, link, proxAtualizacao }: FerramentaCardProps) {
  // Usar ID se disponível, fallback para nome normalizado
  const detailsId = id || nome.toLowerCase().replace(/\s+/g, '-');

  return (
    // ...
    <Link href={`/ferramentas/${detailsId}`}>
```

**Teste**: Verificar que o componente compila sem erros

---

### PASSO 2: Atualizar DashboardCard.tsx

**Mudanças**:
1. Adicionar `id?: string` na interface
2. Usar `id` ao invés de nome normalizado para o link

```typescript
// ANTES
interface DashboardCardProps {
  nome: string;
  descricao: string;
  link: string;
  area: string;
  corBorda?: string;
}

export default function DashboardCard({ nome, descricao, link, area }: DashboardCardProps) {
  const detailsId = nome
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '') || '';
  
  return (
    // ...
    <Link href={`/dashboards/${detailsId}`}>
```

```typescript
// DEPOIS
interface DashboardCardProps {
  id?: string;  // ADICIONAR
  nome: string;
  descricao: string;
  link: string;
  area: string;
  corBorda?: string;
}

export default function DashboardCard({ id, nome, descricao, link, area }: DashboardCardProps) {
  // Usar ID se disponível, fallback para nome normalizado
  const detailsId = id || nome.toLowerCase().replace(/\s+/g, '-');
  
  return (
    // ...
    <Link href={`/dashboards/${detailsId}`}>
```

**Teste**: Verificar que o componente compila sem erros

---

### PASSO 3: Atualizar DocCard.tsx

**Mudanças**:
1. Adicionar `id?: string` na interface
2. Usar `id` ao invés de processo normalizado para o link

```typescript
// ANTES
interface DocCardProps {
  processo: string;
  area: string;
  link: string;
}

export const DocCard: React.FC<DocCardProps> = ({ processo, area, link }) => {
  const detailsId = processo
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '') || '';
  
  return (
    // ...
    <Link href={`/docs/${detailsId}`}>
```

```typescript
// DEPOIS
interface DocCardProps {
  id?: string;  // ADICIONAR
  processo: string;
  area: string;
  link: string;
}

export const DocCard: React.FC<DocCardProps> = ({ id, processo, area, link }) => {
  // Usar ID se disponível, fallback para processo normalizado
  const detailsId = id || processo.toLowerCase().replace(/\s+/g, '-');
  
  return (
    // ...
    <Link href={`/docs/${detailsId}`}>
```

**Teste**: Verificar que o componente compila sem erros

---

### PASSO 4: Verificar CardItem.tsx

**Ação**: Verificar se `CardItem.tsx` existe e se precisa de prop `id`

Se o componente for usado para dashboards/docs e não tiver prop `id`:

```typescript
// Adicionar na interface
interface CardItemProps {
  id?: string;  // ADICIONAR se não existir
  title: string;
  description: string;
  link: string;
  area: string;
  icon: React.ReactNode;
}

// Usar no componente
export function CardItem({ id, title, description, link, area, icon }: CardItemProps) {
  const detailsId = id || title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    // ...
    <Link href={`/dashboards/${detailsId}`}>  // ou /docs/ dependendo do uso
```

**Teste**: Verificar que o componente compila sem erros

---

### PASSO 5: Atualizar app/page.tsx

Este é o arquivo mais importante - precisa passar `id` para todos os cards.

#### 5.1 Ferramentas Tab (linha ~680-710)

**ANTES**:
```typescript
ferramentas?.map((item: Ferramenta, i: number) => (
  <FerramentaCard
    key={item.id || i}
    nome={item.nome}
    descricao={item.descricao}
    link={item.link}
    proxAtualizacao={item.proxima_atualizacao}
  />
))
```

**DEPOIS**:
```typescript
ferramentas?.map((item: Ferramenta, i: number) => (
  <FerramentaCard
    key={item.id || i}
    id={item.id}  // ADICIONAR
    nome={item.nome}
    descricao={item.descricao}
    link={item.link}
    proxAtualizacao={item.proxima_atualizacao}
  />
))
```

#### 5.2 Dashboards Tab - Grid View (linha ~400-450)

**ANTES**:
```typescript
.map((item: Dashboard, i: number) => (
  <CardItem
    key={item.id || i}
    title={item.nome}
    description={item.descricao}
    link={item.link}
    area={item.area}
    icon={<BarChart3 className="w-5 h-5" />}
  />
))
```

**DEPOIS**:
```typescript
.map((item: Dashboard, i: number) => (
  <CardItem
    key={item.id || i}
    id={item.id}  // ADICIONAR
    title={item.nome}
    description={item.descricao}
    link={item.link}
    area={item.area}
    icon={<BarChart3 className="w-5 h-5" />}
  />
))
```

#### 5.3 Dashboards Tab - Table View (linha ~480-520)

**ANTES**:
```typescript
.map((item: Dashboard, i: number) => {
  const detailsId = item.nome
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '') || '';
  return (
    <tr key={item.id || i} className="hover:bg-gray-50">
      {/* ... */}
      <Link href={`/dashboards/${detailsId}`}>
        Detalhes
      </Link>
```

**DEPOIS**:
```typescript
.map((item: Dashboard, i: number) => {
  return (
    <tr key={item.id || i} className="hover:bg-gray-50">
      {/* ... */}
      <Link href={`/dashboards/${item.id}`}>
        Detalhes
      </Link>
```

#### 5.4 Documentação Tab - Grid View (linha ~550-600)

**ANTES**:
```typescript
.map((item: Documentacao, i: number) => (
  <div key={item.id || i} className="rounded-2xl...">
    {/* ... */}
    <a href={item.link} target="_blank" rel="noopener noreferrer">
      Acessar <FileText className="w-5 h-5" />
    </a>
  </div>
))
```

**DEPOIS**:
```typescript
.map((item: Documentacao, i: number) => (
  <div key={item.id || i} className="rounded-2xl...">
    {/* ... */}
    <div className="flex gap-2">
      <Link
        href={`/docs/${item.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
      >
        Ver Detalhes
      </Link>
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
      >
        Acessar <FileText className="w-5 h-5" />
      </a>
    </div>
  </div>
))
```

#### 5.5 Documentação Tab - Table View (linha ~620-660)

**ANTES**:
```typescript
.map((item: Documentacao, i: number) => {
  const detailsId = item.nome
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '') || '';
  return (
    <tr key={item.id || i}>
      {/* ... */}
      <Link href={`/docs/${detailsId}`}>
        Detalhes
      </Link>
```

**DEPOIS**:
```typescript
.map((item: Documentacao, i: number) => {
  return (
    <tr key={item.id || i}>
      {/* ... */}
      <Link href={`/docs/${item.id}`}>
        Detalhes
      </Link>
```

#### 5.6 Pesquisas Tab (linha ~730-780)

**ANTES**:
```typescript
.map((item: Pesquisa, i: number) => {
  const detailsId = item.titulo
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '') || '';
  
  return (
    <Card key={item.id || i}>
      {/* ... */}
      <Link href={`/pesquisas/${detailsId}`}>
        Ver Detalhes
      </Link>
```

**DEPOIS**:
```typescript
.map((item: Pesquisa, i: number) => {
  return (
    <Card key={item.id || i}>
      {/* ... */}
      <Link href={`/pesquisas/${item.id}`}>
        Ver Detalhes
      </Link>
```

**Teste**: Verificar que a página compila sem erros

---

## 🧪 TESTES

### Teste 1: Compilação
```bash
npm run build
```
**Esperado**: Build sem erros

### Teste 2: Projetos (já funciona)
1. Abrir home page
2. Clicar em "Projetos"
3. Clicar em "Detalhes" de qualquer projeto
4. **Esperado**: Página de detalhes carrega corretamente

### Teste 3: Ferramentas
1. Abrir home page
2. Clicar em "Ferramentas"
3. Clicar em "Ver Detalhes" de qualquer ferramenta
4. **Esperado**: Página de detalhes carrega corretamente
5. **Verificar**: URL usa ID (ex: `/ferramentas/abc-123-def`)

### Teste 4: Dashboards (Grid)
1. Abrir home page
2. Clicar em "Dashboards"
3. Garantir que está em visualização Grid
4. Clicar em "Detalhes" de qualquer dashboard
5. **Esperado**: Página de detalhes carrega corretamente
6. **Verificar**: URL usa ID

### Teste 5: Dashboards (Tabela)
1. Abrir home page
2. Clicar em "Dashboards"
3. Mudar para visualização Tabela
4. Clicar em "Detalhes" de qualquer dashboard
5. **Esperado**: Página de detalhes carrega corretamente
6. **Verificar**: URL usa ID

### Teste 6: Documentação (Grid)
1. Abrir home page
2. Clicar em "Documentação"
3. Garantir que está em visualização Grid
4. Clicar em "Ver Detalhes" de qualquer doc
5. **Esperado**: Página de detalhes carrega corretamente
6. **Verificar**: URL usa ID

### Teste 7: Documentação (Tabela)
1. Abrir home page
2. Clicar em "Documentação"
3. Mudar para visualização Tabela
4. Clicar em "Detalhes" de qualquer doc
5. **Esperado**: Página de detalhes carrega corretamente
6. **Verificar**: URL usa ID

### Teste 8: Pesquisas
1. Abrir home page
2. Clicar em "Pesquisas"
3. Clicar em "Ver Detalhes" de qualquer pesquisa
4. **Esperado**: Página de detalhes carrega corretamente
5. **Verificar**: URL usa ID

### Teste 9: Console
1. Abrir DevTools (F12)
2. Navegar por todas as abas
3. Clicar em vários botões "Ver Detalhes"
4. **Esperado**: Sem erros no console

### Teste 10: Campos de Gestão
1. Para cada tipo (projeto, ferramenta, dashboard, doc, pesquisa)
2. Abrir página de detalhes
3. **Verificar**: Campos de gestão aparecem:
   - Data Início
   - Última Atualização
   - Responsável
   - Cliente
   - Observação

## ✅ CHECKLIST FINAL

### Implementação
- [ ] FerramentaCard.tsx atualizado
- [ ] DashboardCard.tsx atualizado
- [ ] DocCard.tsx atualizado
- [ ] CardItem.tsx verificado/atualizado
- [ ] app/page.tsx - Ferramentas atualizado
- [ ] app/page.tsx - Dashboards Grid atualizado
- [ ] app/page.tsx - Dashboards Tabela atualizado
- [ ] app/page.tsx - Docs Grid atualizado
- [ ] app/page.tsx - Docs Tabela atualizado
- [ ] app/page.tsx - Pesquisas atualizado

### Testes
- [ ] Build sem erros
- [ ] Projetos - Detalhes funciona
- [ ] Ferramentas - Ver Detalhes funciona
- [ ] Dashboards Grid - Detalhes funciona
- [ ] Dashboards Tabela - Detalhes funciona
- [ ] Docs Grid - Ver Detalhes funciona
- [ ] Docs Tabela - Detalhes funciona
- [ ] Pesquisas - Ver Detalhes funciona
- [ ] Sem erros no console
- [ ] Campos de gestão aparecem em todas as páginas

### Validação
- [ ] Todas as URLs usam IDs
- [ ] Comportamento consistente em todas as abas
- [ ] Nenhuma funcionalidade quebrada
- [ ] Experiência do usuário melhorada

## 🎯 RESULTADO ESPERADO

Após implementação completa:

✅ **Consistência Total**: Todas as abas usam IDs para "Ver Detalhes"  
✅ **URLs Únicas**: Cada item tem URL única e confiável  
✅ **Sem Conflitos**: Itens com mesmo nome não conflitam  
✅ **Experiência Uniforme**: Comportamento previsível em todas as abas  
✅ **Código Limpo**: Padrão claro e fácil de manter  
✅ **Compatibilidade**: URLs antigas continuam funcionando (fallback)  

---

**Tempo Estimado**: 30-45 minutos  
**Complexidade**: 🟢 BAIXA  
**Risco**: 🟢 BAIXO  
**Impacto**: 🔴 ALTO (melhora significativa na experiência)
