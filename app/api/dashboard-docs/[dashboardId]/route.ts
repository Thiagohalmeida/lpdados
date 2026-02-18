import { NextResponse } from 'next/server';
import { getDashboardDocsPayload } from '@/lib/dashboard-docs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ dashboardId: string }> }
) {
  try {
    const { dashboardId } = await params;

    const payload = await getDashboardDocsPayload(dashboardId);

    if (!payload) {
      return NextResponse.json(
        { error: 'Documentacao do dashboard nao encontrada.' },
        { status: 404 }
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Erro ao buscar dashboard docs:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar dashboard docs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
