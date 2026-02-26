import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequestAuthorized } from '@/lib/admin-access';
import { getTelemetryBigQuery, getTelemetryTable } from '@/lib/telemetry';

function normalizeDays(raw: string | null) {
  const value = Number(raw || 30);
  if (!Number.isFinite(value)) return 30;
  if (value < 1) return 1;
  if (value > 180) return 180;
  return Math.floor(value);
}

function toNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value || 0);
  if (value && typeof value === 'object' && 'value' in value) {
    return Number((value as { value: string }).value || 0);
  }
  return 0;
}

function toDateString(value: unknown) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (value && typeof value === 'object' && 'value' in value) {
    return String((value as { value: string }).value || '');
  }
  return String(value);
}

export async function GET(request: NextRequest) {
  if (!(await isAdminRequestAuthorized())) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const days = normalizeDays(request.nextUrl.searchParams.get('days'));
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);

    const fromIso = from.toISOString();
    const toIso = to.toISOString();
    const table = getTelemetryTable();
    const bigquery = getTelemetryBigQuery();

    const params = { from_ts: fromIso, to_ts: toIso };

    const totalsQuery = `
      SELECT
        COUNT(*) AS events,
        COUNTIF(event_type = 'page_view') AS page_views,
        COUNT(DISTINCT user_email) AS unique_users,
        COUNT(DISTINCT page_path) AS unique_pages
      FROM \`${table}\`
      WHERE event_ts >= TIMESTAMP(@from_ts)
        AND event_ts < TIMESTAMP(@to_ts)
    `;

    const topPagesQuery = `
      SELECT
        page_path,
        COUNT(*) AS views,
        COUNT(DISTINCT user_email) AS unique_users
      FROM \`${table}\`
      WHERE event_ts >= TIMESTAMP(@from_ts)
        AND event_ts < TIMESTAMP(@to_ts)
      GROUP BY page_path
      ORDER BY views DESC
      LIMIT 15
    `;

    const topUsersQuery = `
      SELECT
        user_email,
        COUNT(*) AS views,
        COUNT(DISTINCT page_path) AS unique_pages
      FROM \`${table}\`
      WHERE event_ts >= TIMESTAMP(@from_ts)
        AND event_ts < TIMESTAMP(@to_ts)
      GROUP BY user_email
      ORDER BY views DESC
      LIMIT 15
    `;

    const dailyQuery = `
      SELECT
        DATE(event_ts) AS day,
        COUNT(*) AS views,
        COUNT(DISTINCT user_email) AS users
      FROM \`${table}\`
      WHERE event_ts >= TIMESTAMP(@from_ts)
        AND event_ts < TIMESTAMP(@to_ts)
      GROUP BY day
      ORDER BY day
    `;

    const [totalsRowsResult, topPagesResult, topUsersResult, dailyResult] = await Promise.all([
      bigquery.query({ query: totalsQuery, params }),
      bigquery.query({ query: topPagesQuery, params }),
      bigquery.query({ query: topUsersQuery, params }),
      bigquery.query({ query: dailyQuery, params }),
    ]);

    const totalsRows = totalsRowsResult[0] as Array<Record<string, unknown>>;
    const topPagesRows = topPagesResult[0] as Array<Record<string, unknown>>;
    const topUsersRows = topUsersResult[0] as Array<Record<string, unknown>>;
    const dailyRows = dailyResult[0] as Array<Record<string, unknown>>;

    const totalsRaw = totalsRows[0] || {};

    return NextResponse.json({
      success: true,
      period: {
        days,
        from: fromIso,
        to: toIso,
      },
      totals: {
        events: toNumber(totalsRaw.events),
        page_views: toNumber(totalsRaw.page_views),
        unique_users: toNumber(totalsRaw.unique_users),
        unique_pages: toNumber(totalsRaw.unique_pages),
      },
      top_pages: topPagesRows.map((row) => ({
        page_path: String(row.page_path || ''),
        views: toNumber(row.views),
        unique_users: toNumber(row.unique_users),
      })),
      top_users: topUsersRows.map((row) => ({
        user_email: String(row.user_email || ''),
        views: toNumber(row.views),
        unique_pages: toNumber(row.unique_pages),
      })),
      daily: dailyRows.map((row) => ({
        day: toDateString(row.day),
        views: toNumber(row.views),
        users: toNumber(row.users),
      })),
    });
  } catch (error) {
    console.error('Erro ao gerar overview de telemetria:', error);
    return NextResponse.json(
      {
        error: 'Erro ao gerar indicadores de telemetria',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
