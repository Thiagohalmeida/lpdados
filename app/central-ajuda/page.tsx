import Link from "next/link";
import { BookOpen, LayoutGrid, FileSpreadsheet, FileJson, AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const modulos = [
  { nome: "Projetos", descricao: "Portifolio de iniciativas e status de entrega." },
  { nome: "Dashboards", descricao: "Acesso aos paineis analiticos e contexto de leitura." },
  { nome: "Documentacao", descricao: "Guias e referenciais de processos internos." },
  { nome: "Ferramentas", descricao: "Plataformas e links operacionais utilizados no dia a dia." },
  { nome: "Pesquisas", descricao: "Base de estudos e conteudos externos relevantes." },
  { nome: "Admin", descricao: "Cadastro, edicao e importacoes em lote (CSV/JSON)." },
];

export default function CentralAjudaPage() {
  return (
    <main className="min-h-screen bg-blue-50">
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white">
        <div className="container mx-auto px-4 py-12">
          <p className="text-sm uppercase tracking-wide text-blue-100">Central de Ajuda</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">Como usar o portal de Business intelligence</h1>
          <p className="mt-4 max-w-3xl text-blue-100">
            Esta pagina concentra o que existe no portal, como navegar e como executar os fluxos mais comuns sem erro.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/portal">
              <Button variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
                Ir para o portal de conteudos
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent">
                Acessar admin
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <LayoutGrid className="h-5 w-5" />
              O que existe no portal
            </CardTitle>
            <CardDescription>Catalogo rapido de modulos e finalidade.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modulos.map((modulo) => (
              <div key={modulo.nome} className="rounded-lg border border-blue-100 bg-white p-4">
                <h3 className="font-semibold text-blue-900">{modulo.nome}</h3>
                <p className="text-sm text-gray-600 mt-1">{modulo.descricao}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <BookOpen className="h-5 w-5" />
              Como usar em 4 passos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p><span className="font-semibold text-blue-700">1.</span> Escolha a aba do tema que voce precisa.</p>
            <p><span className="font-semibold text-blue-700">2.</span> Use busca e filtros para reduzir os resultados.</p>
            <p><span className="font-semibold text-blue-700">3.</span> Abra detalhes do item para entender contexto, status e links oficiais.</p>
            <p><span className="font-semibold text-blue-700">4.</span> Para manutencao de dados, use o Admin (cadastro unico ou importacao em lote).</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <FileSpreadsheet className="h-5 w-5" />
                Fluxo CSV (pesquisas)
              </CardTitle>
              <CardDescription>Cabecalho esperado: titulo, fonte, link, data, conteudo, tema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>1. Acesse <span className="font-mono text-xs">/admin/pesquisas</span>.</p>
              <p>2. Clique em sincronizar CSV e selecione o arquivo.</p>
              <p>3. Escolha o modo: <span className="font-semibold">upsert</span> ou <span className="font-semibold">replace</span>.</p>
              <p>4. Revise totais: validas, ignoradas, inseridas, atualizadas e erros.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <FileJson className="h-5 w-5" />
                Fluxo JSON (docs de dashboard)
              </CardTitle>
              <CardDescription>Estrutura base: mode, dashboard_id, version, generated_at, source, views.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>1. Acesse <span className="font-mono text-xs">/admin/dashboard-docs</span>.</p>
              <p>2. Envie JSON com <span className="font-mono text-xs">views[].insights[]</span> e <span className="font-mono text-xs">views[].glossary_fields[]</span>.</p>
              <p>3. Use <span className="font-semibold">replace</span> para carga completa ou <span className="font-semibold">upsert</span> para incremental.</p>
              <p>4. Valide com GET por <span className="font-mono text-xs">dashboard_id</span> antes de publicar.</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <AlertTriangle className="h-5 w-5" />
              FAQ rapido de erros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p><span className="font-semibold">401:</span> cookie de admin ausente ou invalido.</p>
            <p><span className="font-semibold">500 na importacao:</span> validar cabecalho, tipos e formato da data.</p>
            <p><span className="font-semibold">Schema/type error:</span> revisar campos nulos e arrays no payload enviado.</p>
            <p><span className="font-semibold">Duplicidade:</span> usar modo replace quando a fonte oficial for completa.</p>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link href="/portal">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Abrir conteudos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              Ir para gestao admin
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
