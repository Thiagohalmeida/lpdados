'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Save, X, Upload, RefreshCw } from 'lucide-react';
import type { Pesquisa } from '@/types/bi-platform';

type ImportMode = 'upsert' | 'replace';

type ImportResult = {
  success: boolean;
  mode: ImportMode;
  total: number;
  valid: number;
  skipped: number;
  inserted: number;
  updated: number;
  backup_table?: string;
  errors?: string[];
};

export default function AdminPesquisasPage() {
  const [pesquisas, setPesquisas] = useState<Pesquisa[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);
  const [formData, setFormData] = useState<Partial<Pesquisa>>({});
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('upsert');
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    carregarPesquisas();
  }, []);

  const carregarPesquisas = async () => {
    try {
      const response = await fetch(`/api/pesquisas?_ts=${Date.now()}`, { cache: 'no-store' });
      const data = await response.json();
      setPesquisas(data);
    } catch (error) {
      console.error('Erro ao carregar pesquisas:', error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarCriacao = () => {
    setFormData({
      titulo: '',
      fonte: '',
      link: '',
      data: new Date().toISOString().split('T')[0],
      conteudo: '',
      tema: '',
    });
    setCriando(true);
  };

  const iniciarEdicao = (pesquisa: Pesquisa) => {
    setFormData(pesquisa);
    setEditando(pesquisa.id);
  };

  const cancelar = () => {
    setFormData({});
    setEditando(null);
    setCriando(false);
  };

  const salvar = async () => {
    try {
      const url = editando ? `/api/admin/pesquisas/${editando}` : '/api/admin/pesquisas';
      const method = editando ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await carregarPesquisas();
        cancelar();
      } else {
        alert('Erro ao salvar pesquisa');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar pesquisa');
    }
  };

  const excluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pesquisa?')) return;

    try {
      const response = await fetch(`/api/admin/pesquisas/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await carregarPesquisas();
      } else {
        alert('Erro ao excluir pesquisa');
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir pesquisa');
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      setImportError('Selecione um arquivo CSV.');
      return;
    }

    if (importMode === 'replace') {
      const confirmReplace = window.confirm('Modo replace vai substituir todas as pesquisas. Deseja continuar?');
      if (!confirmReplace) return;
    }

    setImportLoading(true);
    setImportError(null);
    setImportResult(null);

    try {
      const csvText = await importFile.text();
      const response = await fetch('/api/admin/pesquisas/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText, mode: importMode }),
      });

      const data = await response.json();
      if (!response.ok) {
        setImportError(data?.error || 'Erro ao importar CSV.');
        setImportResult(null);
        return;
      }

      setImportResult(data as ImportResult);
      await carregarPesquisas();
    } catch (error) {
      console.error('Erro ao importar CSV:', error);
      setImportError('Erro ao importar CSV.');
    } finally {
      setImportLoading(false);
    }
  };

  const openImportModal = () => {
    setImportError(null);
    setImportResult(null);
    setImportFile(null);
    setImportMode('upsert');
    setImportOpen(true);
  };

  if (loading) return <div className="container mx-auto px-4 py-12"><p>Carregando...</p></div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Pesquisas</h1>
          <p className="text-gray-600">{pesquisas.length} pesquisas cadastradas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => carregarPesquisas()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" onClick={openImportModal}>
            <Upload className="h-4 w-4 mr-2" />
            Sincronizar CSV
          </Button>
          <Button onClick={iniciarCriacao} disabled={criando || editando !== null}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Pesquisa
          </Button>
        </div>
      </div>

      {(criando || editando) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{criando ? 'Nova Pesquisa' : 'Editar Pesquisa'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Titulo *</label>
              <Input
                value={formData.titulo || ''}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Titulo da pesquisa"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Fonte *</label>
              <Input
                value={formData.fonte || ''}
                onChange={(e) => setFormData({ ...formData, fonte: e.target.value })}
                placeholder="Fonte da pesquisa"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Link</label>
              <Input
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Data *</label>
              <Input
                type="date"
                value={formData.data || ''}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Conteudo *</label>
              <Textarea
                value={formData.conteudo || ''}
                onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                placeholder="Conteudo da pesquisa"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tema *</label>
              <Input
                value={formData.tema || ''}
                onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                placeholder="Tema da pesquisa"
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-semibold mb-3">Campos de Gestao</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Data Inicio</label>
                  <Input
                    type="date"
                    value={formData.data_inicio || ''}
                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Responsavel</label>
                  <select
                    value={formData.responsavel || ''}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value as any })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Selecione...</option>
                    <option value="Thiago">Thiago</option>
                    <option value="Leonardo">Leonardo</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium mb-1 block">Cliente</label>
                <select
                  value={formData.cliente || ''}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value as any })}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Selecione...</option>
                  <option value="Interno">Interno</option>
                  <option value="Externo">Externo</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium mb-1 block">Observacao</label>
                <Textarea
                  value={formData.observacao || ''}
                  onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                  placeholder="Observacoes adicionais"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={salvar} disabled={!formData.titulo || !formData.fonte || !formData.data || !formData.conteudo || !formData.tema}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button variant="outline" onClick={cancelar}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pesquisas.map((pesquisa, index) => (
          <Card key={`${pesquisa.id}-${index}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold">{pesquisa.titulo}</h3>
                    <span className="px-2 py-1 rounded text-xs bg-purple-50 text-purple-700">{pesquisa.tema}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{pesquisa.conteudo}</p>
                  <div className="flex gap-2 text-xs text-gray-500 mb-2">
                    <span>Fonte: {pesquisa.fonte}</span>
                    <span>- Data: {pesquisa.data}</span>
                  </div>
                  {pesquisa.link && (
                    <a href={pesquisa.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      {pesquisa.link}
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => iniciarEdicao(pesquisa)} disabled={criando || editando !== null}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => excluir(pesquisa.id)} disabled={criando || editando !== null} className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={importOpen}
        onOpenChange={(open) => {
          setImportOpen(open);
          if (!open) {
            setImportError(null);
            setImportResult(null);
          }
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Sincronizar CSV</DialogTitle>
            <DialogDescription>
              Envie um CSV com cabecalho: titulo, fonte, link, data, conteudo, tema.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Arquivo CSV</label>
              <Input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => {
                  setImportFile(e.target.files?.[0] || null);
                  setImportError(null);
                  setImportResult(null);
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Modo</label>
              <select
                value={importMode}
                onChange={(e) => {
                  setImportMode(e.target.value as ImportMode);
                  setImportError(null);
                  setImportResult(null);
                }}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="upsert">Upsert (atualiza e insere)</option>
                <option value="replace">Replace (substitui tudo)</option>
              </select>
            </div>

            {importError && <p className="text-sm text-red-600">{importError}</p>}

            {importResult && (
              <div className="text-sm text-gray-700 space-y-1">
                <div>Total: {importResult.total}</div>
                <div>Validas: {importResult.valid}</div>
                <div>Ignoradas: {importResult.skipped}</div>
                <div>Inseridas: {importResult.inserted}</div>
                <div>Atualizadas: {importResult.updated}</div>
                {importResult.backup_table && (
                  <div>Backup: {importResult.backup_table}</div>
                )}
                {importResult.errors && importResult.errors.length > 0 && (
                  <>
                    <div>Erros: {importResult.errors.length}</div>
                    <div className="mt-2 max-h-40 overflow-auto rounded border p-2 bg-gray-50">
                      {importResult.errors.map((err, idx) => (
                        <div key={`${idx}-${err}`} className="text-xs text-red-700 py-1 border-b last:border-b-0">
                          {err}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)}>
              Fechar
            </Button>
            <Button onClick={handleImport} disabled={importLoading}>
              {importLoading ? 'Importando...' : 'Importar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
