import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { normalizeDashboardDocsPayload } from '@/lib/dashboard-docs';

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_auth')?.value === 'true';
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const normalized = normalizeDashboardDocsPayload(body, body?.dashboard_id);

    return NextResponse.json({
      success: true,
      normalized,
      summary: {
        views: normalized.views.length,
        insights: normalized.views.reduce((acc, view) => acc + view.insights.length, 0),
        glossary_fields: normalized.views.reduce((acc, view) => acc + view.glossary_fields.length, 0),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Erro ao normalizar payload',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
