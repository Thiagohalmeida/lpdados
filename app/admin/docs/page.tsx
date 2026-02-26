'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import type { Documentacao } from '@/types/bi-platform';

export default function AdminDocsPage() {
  const [docs, setDocs] = useState<Documentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);
  const [formData, setFormData] = useState<Partial<Documentacao>>({});

  useEffect(() => {
    carregarDocs();
  }, []);

  const carregarDocs = async () => {
    try {
      const response = await fetch('/api/docs');
      const data = await response.json();
      setDocs(data);
    } catch (error) {
      console.error('Erro ao carregar docs:', error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarCriacao = () => {
    setFormData({ nome: '', descricao: '', link: '', area: '' });
    setCriando(true);
  };

  const iniciarEdicao = (doc: Documentacao) => {
    setFormData(doc);
    setEditando(doc.nome); // Usar o nome como ID
  };

  const cancelar = () => {
    setFormData({});
    setEditando(null);
    setCriando(false);
  };

  const salvar = async () => {
    try {
      const url = editando ? `/api/admin/docs/${editando}` : '/api/admin/docs';
      const method = editando ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await carregarDocs();
        cancelar();
        alert('✅ Documentação salva com sucesso!');
      } else {
        const error = await response.json();
        alert(`❌ Erro ao salvar documentação: ${error.details || error.error}`);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar documentação');
    }
  };

  const excluir = async (nome: string) => {
    if (!confirm('Tem certeza que deseja excluir esta documentação?')) return;

    try {
      const response = await fetch(`/api/admin/docs/${encodeURIComponent(nome)}`, { method: 'DELETE' });
      if (response.ok) {
        await carregarDocs();
      } else {
        alert('Erro ao excluir documentação');
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir documentação');
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-12"><p>Carregando...</p></div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Documentação</h1>
          <p className="text-gray-600">{docs.length} documentos cadastrados</p>
        </div>
        <Button onClick={iniciarCriacao} disabled={criando || editando !== null}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Documentação
        </Button>
      </div>

      {(criando || editando) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{criando ? 'Nova Documentação' : 'Editar Documentação'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Processo *</label>
              <Input
                value={formData.nome || ''}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome do processo"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Descrição *</label>
              <Textarea
                value={formData.descricao || ''}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Link *</label>
              <Input
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Área *</label>
              <select
                value={formData.area || ''}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Selecione...</option>
                <option value="Tráfego">Tráfego</option>
                <option value="Todas">Todas</option>
                <option value="Growth">Growth</option>
                <option value="Financeiro">Financeiro</option>
                <option value="RH">RH</option>
                <option value="Comercial">Comercial</option>
                <option value="Planejamento">Planejamento</option>
              </select>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-semibold mb-3">Campos de Gestão</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Data Início</label>
                  <Input
                    type="date"
                    value={formData.data_inicio || ''}
                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Responsável</label>
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
                <label className="text-sm font-medium mb-1 block">Observação</label>
                <Textarea
                  value={formData.observacao || ''}
                  onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                  placeholder="Observações adicionais"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={salvar} disabled={!formData.nome || !formData.descricao || !formData.link || !formData.area}>
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
        {docs.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold">{doc.nome}</h3>
                    <span className="px-2 py-1 rounded text-xs bg-green-50 text-green-700">{doc.area}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{doc.descricao}</p>
                  <a href={doc.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline block mb-3">
                    {doc.link}
                  </a>
                  
                  {/* Campos de Gestão */}
                  {(doc.responsavel || doc.cliente || doc.data_inicio || doc.observacao) && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Informações de Gestão:</p>
                      <div className="space-y-1 text-xs text-gray-600">
                        {doc.responsavel && <p>👤 Responsável: {doc.responsavel}</p>}
                        {doc.cliente && <p>🏢 Cliente: {doc.cliente}</p>}
                        {doc.data_inicio && <p>📅 Início: {new Date(doc.data_inicio).toLocaleDateString('pt-BR')}</p>}
                        {doc.ultima_atualizacao && <p>🔄 Atualizado: {new Date(doc.ultima_atualizacao).toLocaleDateString('pt-BR')}</p>}
                        {doc.observacao && <p>📝 Obs: {doc.observacao}</p>}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => iniciarEdicao(doc)} disabled={criando || editando !== null}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => excluir(doc.nome)} disabled={criando || editando !== null} className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
