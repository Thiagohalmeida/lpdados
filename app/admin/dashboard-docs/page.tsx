'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface DashboardItem {
  id: string;
  nome: string;
}

const EXAMPLE_JSON = `{
  "mode": "replace",
  "dashboard_id": "",
  "version": "1.0.0",
  "generated_at": "2026-02-11T10:00:00Z",
  "source": "Dashboard de BI | Visao - Control",
  "views": []
}`;

export default function AdminDashboardDocsPage() {
  const [dashboards, setDashboards] = useState<DashboardItem[]>([]);
  const [selectedDashboardId, setSelectedDashboardId] = useState('');
  const [mode, setMode] = useState<'replace' | 'upsert'>('replace');
  const [inputJson, setInputJson] = useState(EXAMPLE_JSON);
  const [normalizedJson, setNormalizedJson] = useState('');
  const [responseJson, setResponseJson] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isNormalizing, setIsNormalizing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const loadDashboards = async () => {
      try {
        const response = await fetch('/api/itens?tipo=dashboard', { cache: 'no-store' });
        const data = await response.json();

        if (!Array.isArray(data)) return;

        const normalized = data
          .filter((item: any) => item?.id && item?.nome)
          .map((item: any) => ({ id: String(item.id), nome: String(item.nome) }));

        setDashboards(normalized);
        if (normalized.length > 0) {
          setSelectedDashboardId(normalized[0].id);
        }
      } catch {
        setErrorText('Nao foi possivel carregar a lista de dashboards.');
      }
    };

    loadDashboards();
  }, []);

  const selectedDashboardName = useMemo(() => {
    const found = dashboards.find(item => item.id === selectedDashboardId);
    return found?.nome || '';
  }, [dashboards, selectedDashboardId]);

  const loadExample = () => {
    setInputJson(EXAMPLE_JSON);
    setNormalizedJson('');
    setResponseJson('');
    setErrorText('');
  };

  const formatJson = () => {
    setErrorText('');
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, 2));
    } catch {
      setErrorText('JSON invalido. Revise a sintaxe antes de continuar.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || '');
      setInputJson(content);
      setErrorText('');
    };
    reader.readAsText(file);
  };

  const buildPayload = () => {
    const parsed = JSON.parse(inputJson);
    parsed.dashboard_id = selectedDashboardId || parsed.dashboard_id;
    parsed.mode = mode;
    return parsed;
  };

  const normalizePayload = async () => {
    setIsNormalizing(true);
    setErrorText('');
    setResponseJson('');

    try {
      const payload = buildPayload();
      if (!payload.dashboard_id) {
        throw new Error('Selecione um dashboard antes de normalizar.');
      }

      const response = await fetch('/api/admin/dashboard-docs/normalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.details || data?.error || 'Falha ao normalizar payload.');
      }

      setNormalizedJson(JSON.stringify(data.normalized, null, 2));
      setResponseJson(JSON.stringify(data.summary, null, 2));
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : 'Erro ao normalizar payload.');
    } finally {
      setIsNormalizing(false);
    }
  };

  const importPayload = async () => {
    setIsImporting(true);
    setErrorText('');

    try {
      const payload = normalizedJson ? JSON.parse(normalizedJson) : buildPayload();
      if (!payload.dashboard_id) {
        throw new Error('Selecione um dashboard antes de importar.');
      }

      payload.mode = mode;

      const response = await fetch('/api/admin/dashboard-docs/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.details || data?.error || 'Falha ao importar payload.');
      }

      setResponseJson(JSON.stringify(data, null, 2));
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : 'Erro ao importar payload.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Importar Dicionario e Insights</h1>
        <p className="text-gray-600 mt-2">
          Cole o JSON bruto (incluindo extracao de PDF), normalize para o formato oficial e importe sem quebrar os dados existentes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuracao</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Dashboard destino</label>
              <select
                value={selectedDashboardId}
                onChange={(e) => setSelectedDashboardId(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Selecione...</option>
                {dashboards.map((dashboard) => (
                  <option key={dashboard.id} value={dashboard.id}>
                    {dashboard.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Modo de importacao</label>
              <select
                value={mode}
                onChange={(e) => setMode((e.target.value as 'replace' | 'upsert') || 'replace')}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="replace">replace (substitui tudo do dashboard)</option>
                <option value="upsert">upsert (atualiza/inclui sem limpar)</option>
              </select>
            </div>
          </div>

          {selectedDashboardId && (
            <p className="text-xs text-gray-500">
              Dashboard selecionado: <strong>{selectedDashboardName}</strong> ({selectedDashboardId})
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>JSON de entrada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={loadExample}>Carregar template</Button>
            <Button variant="outline" onClick={formatJson}>Formatar JSON</Button>
            <Button variant="outline" onClick={normalizePayload} disabled={isNormalizing}>
              {isNormalizing ? 'Normalizando...' : 'Normalizar para padrao'}
            </Button>
            <label className="inline-flex items-center">
              <Input type="file" accept="application/json,.json" onChange={handleFileUpload} />
            </label>
          </div>
          <Textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            rows={18}
            className="font-mono text-xs"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>JSON normalizado (preview)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea value={normalizedJson} onChange={(e) => setNormalizedJson(e.target.value)} rows={16} className="font-mono text-xs" />
          <div className="flex flex-wrap gap-2">
            <Button onClick={importPayload} disabled={isImporting}>
              {isImporting ? 'Importando...' : 'Importar no BigQuery'}
            </Button>
            {selectedDashboardId && (
              <Link href={`/dashboards/${selectedDashboardId}`}>
                <Button variant="outline">Abrir detalhes do dashboard</Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {(errorText || responseJson) && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            {errorText && <p className="text-sm text-red-600 mb-3">{errorText}</p>}
            {responseJson && <pre className="text-xs bg-gray-50 border rounded-md p-3 overflow-auto">{responseJson}</pre>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
