'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

type ItemTipo = 'projeto' | 'dashboard' | 'documentacao' | 'ferramenta';
type TipoFiltro = ItemTipo | 'todos';

type AdminItem = {
  id: string;
  tipo?: ItemTipo;
  nome: string;
  descricao: string;
  status?: string | null;
  data?: string;
  link?: string;
  docs?: string;
  area?: string;
  tecnologias: string[];
  data_inicio?: string | null;
  ultima_atualizacao?: string | null;
  responsavel?: string | null;
  cliente?: string | null;
  observacao?: string | null;
  proxima_atualizacao?: string | null;
};

const TIPO_OPTIONS: Array<{ value: ItemTipo; label: string }> = [
  { value: 'projeto', label: 'Projeto' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'documentacao', label: 'Documentacao' },
  { value: 'ferramenta', label: 'Plataforma' },
];

const AREA_OPTIONS = ['Tráfego', 'Growth', 'Financeiro', 'RH', 'Comercial', 'Planejamento'];

function getTipoLabel(tipo: ItemTipo | undefined) {
  if (!tipo) return 'Projeto';
  const match = TIPO_OPTIONS.find((option) => option.value === tipo);
  return match?.label ?? tipo;
}

export default function AdminProjetosPage() {
  const [itens, setItens] = useState<AdminItem[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<TipoFiltro>('todos');
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminItem>>({});

  useEffect(() => {
    carregarItens(filtroTipo);
  }, [filtroTipo]);

  const carregarItens = async (tipo: TipoFiltro) => {
    try {
      const endpoint = tipo === 'todos' ? '/api/itens' : `/api/itens?tipo=${tipo}`;
      const response = await fetch(endpoint, {
        cache: 'no-store',
      });
      const data = await response.json();
      setItens(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarCriacao = () => {
    const tipoPadrao = filtroTipo === 'todos' ? 'projeto' : filtroTipo;
    setFormData({
      tipo: tipoPadrao,
      nome: '',
      descricao: '',
      status: 'em desenvolvimento',
      data: new Date().toISOString().split('T')[0],
      link: '',
      docs: '',
      area: '',
      tecnologias: [],
      proxima_atualizacao: '',
    });
    setCriando(true);
  };

  const iniciarEdicao = (item: AdminItem) => {
    setFormData({
      ...item,
      tecnologias: Array.isArray(item.tecnologias) ? item.tecnologias : [],
    });
    setEditando(item.id);
  };

  const cancelar = () => {
    setFormData({});
    setEditando(null);
    setCriando(false);
  };

  const salvar = async () => {
    try {
      const tipoSelecionado = (formData.tipo || 'projeto') as ItemTipo;
      const url = editando
        ? `/api/admin/projetos/${editando}?tipo=${tipoSelecionado}`
        : '/api/admin/projetos';

      const method = editando ? 'PUT' : 'POST';
      const payload = {
        ...formData,
        tipo: tipoSelecionado,
        status: formData.status || null,
        tecnologias: Array.isArray(formData.tecnologias) ? formData.tecnologias : [],
        proxima_atualizacao: formData.proxima_atualizacao || null,
        data_inicio: formData.data_inicio || formData.data || null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await carregarItens(filtroTipo);
        cancelar();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Erro ao salvar item: ${errorData.details || errorData.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar item');
    }
  };

  const excluir = async (id: string, tipo: ItemTipo = 'projeto') => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      const response = await fetch(`/api/admin/projetos/${id}?tipo=${tipo}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await carregarItens(filtroTipo);
      } else {
        alert('Erro ao excluir item');
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir item');
    }
  };

  const podeSalvar = !!formData.nome && !!formData.descricao && !!formData.area;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Itens</h1>
          <p className="text-gray-600">{itens.length} itens cadastrados (projetos, dashboards, docs, plataformas)</p>
        </div>
        <Button onClick={iniciarCriacao} disabled={criando || editando !== null}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Filtrar por Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as TipoFiltro)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="todos">Todos</option>
                {TIPO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {(criando || editando) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{criando ? 'Novo Item' : 'Editar Item'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tipo *</label>
              <select
                value={formData.tipo || 'projeto'}
                onChange={(e) => {
                  const novoTipo = e.target.value as ItemTipo;
                  setFormData({
                    ...formData,
                    tipo: novoTipo,
                  });
                }}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                {TIPO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Nome *</label>
              <Input
                value={formData.nome || ''}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome do item"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Descricao *</label>
              <Textarea
                value={formData.descricao || ''}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descricao do item"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <select
                  value={formData.status || ''}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value || null })}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Selecione...</option>
                  <option value="entregue">Entregue</option>
                  <option value="em desenvolvimento">Em Desenvolvimento</option>
                  <option value="standby">Standby</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Data</label>
                <Input
                  type="date"
                  value={formData.data || ''}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Area *</label>
              <select
                value={formData.area || ''}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Selecione...</option>
                {AREA_OPTIONS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
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
              <label className="text-sm font-medium mb-1 block">Link da Documentacao</label>
              <Input
                value={formData.docs || ''}
                onChange={(e) => setFormData({ ...formData, docs: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tecnologias (separadas por virgula)</label>
              <Input
                value={formData.tecnologias?.join(', ') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tecnologias: e.target.value
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Python, BigQuery, Looker"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Proxima Atualizacao</label>
              <Input
                type="date"
                value={formData.proxima_atualizacao || ''}
                onChange={(e) => setFormData({ ...formData, proxima_atualizacao: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Selecione...</option>
                    <option value="Thiago">Thiago</option>
                    <option value="Leandro">Leandro</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium mb-1 block">Cliente</label>
                <select
                  value={formData.cliente || ''}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
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
              <Button onClick={salvar} disabled={!podeSalvar}>
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

      <div className="space-y-4">
        {itens.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{item.nome}</h3>
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                      {getTipoLabel(item.tipo)}
                    </span>
                    {item.status && (
                      <span className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">{item.status}</span>
                    )}
                    {item.area && <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">{item.area}</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.descricao}</p>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>Data: {item.data_inicio || item.data || '-'}</span>
                    {Array.isArray(item.tecnologias) && item.tecnologias.length > 0 && (
                      <span>- Tecnologias: {item.tecnologias.join(', ')}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => iniciarEdicao(item)}
                    disabled={criando || editando !== null}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => excluir(item.id, item.tipo || 'projeto')}
                    disabled={criando || editando !== null}
                    className="text-red-600 hover:text-red-700"
                  >
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
