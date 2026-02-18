import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  dashboardDocsTables,
  getDashboardDocsBigQuery,
  getDashboardDocsPayload,
} from '@/lib/dashboard-docs';

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_auth')?.value === 'true';
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ dashboardId: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

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
    console.error('Erro ao buscar dashboard docs (admin):', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar dashboard docs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ dashboardId: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const { dashboardId } = await params;
    const { searchParams } = new URL(request.url);
    const deleteSnapshots = searchParams.get('delete_snapshots') === 'true';

    const bigquery = getDashboardDocsBigQuery();

    await bigquery.query({
      query: `DELETE FROM \`${dashboardDocsTables.TABLE_INSIGHTS}\` WHERE dashboard_id = @dashboard_id`,
      params: { dashboard_id: dashboardId },
      types: { dashboard_id: 'STRING' },
    });

    await bigquery.query({
      query: `DELETE FROM \`${dashboardDocsTables.TABLE_GLOSSARY}\` WHERE dashboard_id = @dashboard_id`,
      params: { dashboard_id: dashboardId },
      types: { dashboard_id: 'STRING' },
    });

    await bigquery.query({
      query: `DELETE FROM \`${dashboardDocsTables.TABLE_VIEWS}\` WHERE dashboard_id = @dashboard_id`,
      params: { dashboard_id: dashboardId },
      types: { dashboard_id: 'STRING' },
    });

    if (deleteSnapshots) {
      await bigquery.query({
        query: `DELETE FROM \`${dashboardDocsTables.TABLE_PAYLOADS}\` WHERE dashboard_id = @dashboard_id`,
        params: { dashboard_id: dashboardId },
        types: { dashboard_id: 'STRING' },
      });
    }

    return NextResponse.json({
      success: true,
      dashboard_id: dashboardId,
      snapshots_deleted: deleteSnapshots,
    });
  } catch (error) {
    console.error('Erro ao remover dashboard docs:', error);
    return NextResponse.json(
      {
        error: 'Erro ao remover dashboard docs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
