'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';

type OverviewResponse = {
  success: boolean;
  period: { days: number; from: string; to: string };
  totals: {
    events: number;
    page_views: number;
    unique_users: number;
    unique_pages: number;
  };
  top_pages: Array<{ page_path: string; views: number; unique_users: number }>;
  top_users: Array<{ user_email: string; views: number; unique_pages: number }>;
  daily: Array<{ day: string; views: number; users: number }>;
};

export default function AdminTelemetriaPage() {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OverviewResponse | null>(null);

  const fetchOverview = async (selectedDays: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/telemetria/overview?days=${selectedDays}`, {
        cache: 'no-store',
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.details || json?.error || 'Erro ao carregar telemetria');
      }

      setData(json);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar telemetria');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview(days);
  }, [days]);

  const periodText = useMemo(() => {
    if (!data?.period) return '-';
    const from = new Date(data.period.from).toLocaleDateString('pt-BR');
    const to = new Date(data.period.to).toLocaleDateString('pt-BR');
    return `${from} - ${to}`;
  }, [data]);

  return (
    <div className="container mx-auto px-4 py-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Telemetria do Portal</h1>
          <p className="text-sm text-gray-600 mt-1">Indicadores de uso por pagina e por usuario autenticado.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <Button variant="outline" onClick={() => fetchOverview(days)} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <label htmlFor="days" className="text-sm font-medium text-gray-700">
            Periodo:
          </label>
          <select
            id="days"
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="border rounded-md px-3 py-2 text-sm w-full sm:w-48"
          >
            <option value={7}>Ultimos 7 dias</option>
            <option value={15}>Ultimos 15 dias</option>
            <option value={30}>Ultimos 30 dias</option>
            <option value={60}>Ultimos 60 dias</option>
            <option value={90}>Ultimos 90 dias</option>
          </select>
          <span className="text-sm text-gray-500">{periodText}</span>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="py-10 text-center text-gray-600">Carregando indicadores...</CardContent>
        </Card>
      )}

      {!loading && error && (
        <Card>
          <CardContent className="py-8">
            <p className="text-red-600 font-medium mb-2">Erro ao carregar telemetria</p>
            <p className="text-sm text-gray-700">{error}</p>
            <p className="text-xs text-gray-500 mt-2">
              Verifique se a tabela de telemetria foi criada no BigQuery.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.totals.events}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.totals.page_views}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Usuarios Unicos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.totals.unique_users}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Paginas Unicas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.totals.unique_pages}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top paginas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.top_pages.length === 0 && <p className="text-sm text-gray-500">Sem dados no periodo.</p>}
                {data.top_pages.map((row) => (
                  <div key={row.page_path} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                    <div>
                      <p className="font-medium text-sm">{row.page_path}</p>
                      <p className="text-xs text-gray-500">{row.unique_users} usuarios</p>
                    </div>
                    <p className="font-semibold">{row.views}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top usuarios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.top_users.length === 0 && <p className="text-sm text-gray-500">Sem dados no periodo.</p>}
                {data.top_users.map((row) => (
                  <div key={row.user_email} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                    <div>
                      <p className="font-medium text-sm">{row.user_email}</p>
                      <p className="text-xs text-gray-500">{row.unique_pages} paginas unicas</p>
                    </div>
                    <p className="font-semibold">{row.views}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolucao diaria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Dia</th>
                      <th className="text-right py-2">Views</th>
                      <th className="text-right py-2">Usuarios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.daily.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-gray-500">
                          Sem dados no periodo.
                        </td>
                      </tr>
                    )}
                    {data.daily.map((row) => (
                      <tr key={row.day} className="border-b">
                        <td className="py-2">{new Date(row.day).toLocaleDateString('pt-BR')}</td>
                        <td className="py-2 text-right">{row.views}</td>
                        <td className="py-2 text-right">{row.users}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
