import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  dashboardDocsTables,
  dashboardExists,
  getDashboardDocsBigQuery,
  normalizeDashboardDocsPayload,
} from '@/lib/dashboard-docs';

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_auth')?.value === 'true';
}

function sanitizeMode(value: unknown): 'replace' | 'upsert' {
  return String(value || '').toLowerCase() === 'upsert' ? 'upsert' : 'replace';
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const mode = sanitizeMode(body?.mode);

    const normalized = normalizeDashboardDocsPayload(body, body?.dashboard_id);

    if (!(await dashboardExists(normalized.dashboard_id))) {
      return NextResponse.json(
        {
          error: 'Dashboard nao encontrado em itens_portal.',
          dashboard_id: normalized.dashboard_id,
        },
        { status: 400 }
      );
    }

    const bigquery = getDashboardDocsBigQuery();

    if (mode === 'replace') {
      await bigquery.query({
        query: `DELETE FROM \`${dashboardDocsTables.TABLE_INSIGHTS}\` WHERE dashboard_id = @dashboard_id`,
        params: { dashboard_id: normalized.dashboard_id },
        types: { dashboard_id: 'STRING' },
      });

      await bigquery.query({
        query: `DELETE FROM \`${dashboardDocsTables.TABLE_GLOSSARY}\` WHERE dashboard_id = @dashboard_id`,
        params: { dashboard_id: normalized.dashboard_id },
        types: { dashboard_id: 'STRING' },
      });

      await bigquery.query({
        query: `DELETE FROM \`${dashboardDocsTables.TABLE_VIEWS}\` WHERE dashboard_id = @dashboard_id`,
        params: { dashboard_id: normalized.dashboard_id },
        types: { dashboard_id: 'STRING' },
      });
    }

    let insertedViews = 0;
    let insertedInsights = 0;
    let insertedGlossaryFields = 0;

    for (const view of normalized.views) {
      if (mode === 'upsert') {
        await bigquery.query({
          query: `
            MERGE \`${dashboardDocsTables.TABLE_VIEWS}\` T
            USING (SELECT @dashboard_id AS dashboard_id, @view_id AS view_id) S
            ON T.dashboard_id = S.dashboard_id AND T.view_id = S.view_id
            WHEN MATCHED THEN
              UPDATE SET
                title = @title,
                view_type = @view_type,
                source = @source,
                version = @version,
                generated_at = TIMESTAMP(@generated_at),
                sort_order = @sort_order,
                status = @status,
                metric_owner = @metric_owner,
                data_source = @data_source,
                updated_at = CURRENT_TIMESTAMP()
            WHEN NOT MATCHED THEN
              INSERT (
                dashboard_id,
                view_id,
                title,
                view_type,
                source,
                version,
                generated_at,
                sort_order,
                status,
                metric_owner,
                data_source,
                created_at,
                updated_at
              )
              VALUES (
                @dashboard_id,
                @view_id,
                @title,
                @view_type,
                @source,
                @version,
                TIMESTAMP(@generated_at),
                @sort_order,
                @status,
                @metric_owner,
                @data_source,
                CURRENT_TIMESTAMP(),
                CURRENT_TIMESTAMP()
              )
          `,
          params: {
            dashboard_id: normalized.dashboard_id,
            view_id: view.view_id,
            title: view.title,
            view_type: view.view_type,
            source: view.source || normalized.source,
            version: view.version || normalized.version,
            generated_at: view.generated_at || normalized.generated_at,
            sort_order: view.sort_order,
            status: view.status || 'ativo',
            metric_owner: view.metric_owner,
            data_source: view.data_source,
          },
          types: {
            dashboard_id: 'STRING',
            view_id: 'STRING',
            title: 'STRING',
            view_type: 'STRING',
            source: 'STRING',
            version: 'STRING',
            generated_at: 'STRING',
            sort_order: 'INT64',
            status: 'STRING',
            metric_owner: 'STRING',
            data_source: 'STRING',
          },
        });
      } else {
        await bigquery.query({
          query: `
            INSERT INTO \`${dashboardDocsTables.TABLE_VIEWS}\` (
              dashboard_id,
              view_id,
              title,
              view_type,
              source,
              version,
              generated_at,
              sort_order,
              status,
              metric_owner,
              data_source,
              created_at,
              updated_at
            )
            VALUES (
              @dashboard_id,
              @view_id,
              @title,
              @view_type,
              @source,
              @version,
              TIMESTAMP(@generated_at),
              @sort_order,
              @status,
              @metric_owner,
              @data_source,
              CURRENT_TIMESTAMP(),
              CURRENT_TIMESTAMP()
            )
          `,
          params: {
            dashboard_id: normalized.dashboard_id,
            view_id: view.view_id,
            title: view.title,
            view_type: view.view_type,
            source: view.source || normalized.source,
            version: view.version || normalized.version,
            generated_at: view.generated_at || normalized.generated_at,
            sort_order: view.sort_order,
            status: view.status || 'ativo',
            metric_owner: view.metric_owner,
            data_source: view.data_source,
          },
          types: {
            dashboard_id: 'STRING',
            view_id: 'STRING',
            title: 'STRING',
            view_type: 'STRING',
            source: 'STRING',
            version: 'STRING',
            generated_at: 'STRING',
            sort_order: 'INT64',
            status: 'STRING',
            metric_owner: 'STRING',
            data_source: 'STRING',
          },
        });
      }

      insertedViews += 1;

      for (const insight of view.insights) {
        if (mode === 'upsert') {
          await bigquery.query({
            query: `
              MERGE \`${dashboardDocsTables.TABLE_INSIGHTS}\` T
              USING (
                SELECT
                  @dashboard_id AS dashboard_id,
                  @view_id AS view_id,
                  @insight_id AS insight_id
              ) S
              ON T.dashboard_id = S.dashboard_id
                AND T.view_id = S.view_id
                AND T.insight_id = S.insight_id
              WHEN MATCHED THEN
                UPDATE SET
                  title = @title,
                  description = @description,
                  notes = @notes,
                  tags = @tags,
                  sort_order = @sort_order,
                  is_active = TRUE,
                  updated_at = CURRENT_TIMESTAMP()
              WHEN NOT MATCHED THEN
                INSERT (
                  dashboard_id,
                  view_id,
                  insight_id,
                  title,
                  description,
                  notes,
                  tags,
                  sort_order,
                  is_active,
                  source_file,
                  created_at,
                  updated_at
                )
                VALUES (
                  @dashboard_id,
                  @view_id,
                  @insight_id,
                  @title,
                  @description,
                  @notes,
                  @tags,
                  @sort_order,
                  TRUE,
                  @source_file,
                  CURRENT_TIMESTAMP(),
                  CURRENT_TIMESTAMP()
                )
            `,
            params: {
              dashboard_id: normalized.dashboard_id,
              view_id: view.view_id,
              insight_id: insight.insight_id,
              title: insight.title,
              description: insight.description,
              notes: insight.notes,
              tags: insight.tags,
              sort_order: insight.sort_order,
              source_file: normalized.source,
            },
            types: {
              dashboard_id: 'STRING',
              view_id: 'STRING',
              insight_id: 'STRING',
              title: 'STRING',
              description: 'STRING',
              notes: ['STRING'],
              tags: ['STRING'],
              sort_order: 'INT64',
              source_file: 'STRING',
            },
          });
        } else {
          await bigquery.query({
            query: `
              INSERT INTO \`${dashboardDocsTables.TABLE_INSIGHTS}\` (
                dashboard_id,
                view_id,
                insight_id,
                title,
                description,
                notes,
                tags,
                sort_order,
                is_active,
                source_file,
                created_at,
                updated_at
              )
              VALUES (
                @dashboard_id,
                @view_id,
                @insight_id,
                @title,
                @description,
                @notes,
                @tags,
                @sort_order,
                TRUE,
                @source_file,
                CURRENT_TIMESTAMP(),
                CURRENT_TIMESTAMP()
              )
            `,
            params: {
              dashboard_id: normalized.dashboard_id,
              view_id: view.view_id,
              insight_id: insight.insight_id,
              title: insight.title,
              description: insight.description,
              notes: insight.notes,
              tags: insight.tags,
              sort_order: insight.sort_order,
              source_file: normalized.source,
            },
            types: {
              dashboard_id: 'STRING',
              view_id: 'STRING',
              insight_id: 'STRING',
              title: 'STRING',
              description: 'STRING',
              notes: ['STRING'],
              tags: ['STRING'],
              sort_order: 'INT64',
              source_file: 'STRING',
            },
          });
        }

        insertedInsights += 1;
      }

      for (const field of view.glossary_fields) {
        if (mode === 'upsert') {
          await bigquery.query({
            query: `
              MERGE \`${dashboardDocsTables.TABLE_GLOSSARY}\` T
              USING (
                SELECT
                  @dashboard_id AS dashboard_id,
                  @view_id AS view_id,
                  @field_id AS field_id
              ) S
              ON T.dashboard_id = S.dashboard_id
                AND T.view_id = S.view_id
                AND T.field_id = S.field_id
              WHEN MATCHED THEN
                UPDATE SET
                  name = @name,
                  description = @description,
                  formula = @formula,
                  example = @example,
                  unit = @unit,
                  tags = @tags,
                  sort_order = @sort_order,
                  is_active = TRUE,
                  updated_at = CURRENT_TIMESTAMP()
              WHEN NOT MATCHED THEN
                INSERT (
                  dashboard_id,
                  view_id,
                  field_id,
                  name,
                  description,
                  formula,
                  example,
                  unit,
                  tags,
                  sort_order,
                  is_active,
                  source_file,
                  created_at,
                  updated_at
                )
                VALUES (
                  @dashboard_id,
                  @view_id,
                  @field_id,
                  @name,
                  @description,
                  @formula,
                  @example,
                  @unit,
                  @tags,
                  @sort_order,
                  TRUE,
                  @source_file,
                  CURRENT_TIMESTAMP(),
                  CURRENT_TIMESTAMP()
                )
            `,
            params: {
              dashboard_id: normalized.dashboard_id,
              view_id: view.view_id,
              field_id: field.field_id,
              name: field.name,
              description: field.description,
              formula: field.formula,
              example: field.example,
              unit: field.unit,
              tags: field.tags,
              sort_order: field.sort_order,
              source_file: normalized.source,
            },
            types: {
              dashboard_id: 'STRING',
              view_id: 'STRING',
              field_id: 'STRING',
              name: 'STRING',
              description: 'STRING',
              formula: 'STRING',
              example: 'STRING',
              unit: 'STRING',
              tags: ['STRING'],
              sort_order: 'INT64',
              source_file: 'STRING',
            },
          });
        } else {
          await bigquery.query({
            query: `
              INSERT INTO \`${dashboardDocsTables.TABLE_GLOSSARY}\` (
                dashboard_id,
                view_id,
                field_id,
                name,
                description,
                formula,
                example,
                unit,
                tags,
                sort_order,
                is_active,
                source_file,
                created_at,
                updated_at
              )
              VALUES (
                @dashboard_id,
                @view_id,
                @field_id,
                @name,
                @description,
                @formula,
                @example,
                @unit,
                @tags,
                @sort_order,
                TRUE,
                @source_file,
                CURRENT_TIMESTAMP(),
                CURRENT_TIMESTAMP()
              )
            `,
            params: {
              dashboard_id: normalized.dashboard_id,
              view_id: view.view_id,
              field_id: field.field_id,
              name: field.name,
              description: field.description,
              formula: field.formula,
              example: field.example,
              unit: field.unit,
              tags: field.tags,
              sort_order: field.sort_order,
              source_file: normalized.source,
            },
            types: {
              dashboard_id: 'STRING',
              view_id: 'STRING',
              field_id: 'STRING',
              name: 'STRING',
              description: 'STRING',
              formula: 'STRING',
              example: 'STRING',
              unit: 'STRING',
              tags: ['STRING'],
              sort_order: 'INT64',
              source_file: 'STRING',
            },
          });
        }

        insertedGlossaryFields += 1;
      }
    }

    await bigquery.query({
      query: `
        INSERT INTO \`${dashboardDocsTables.TABLE_PAYLOADS}\` (
          payload_id,
          dashboard_id,
          version,
          generated_at,
          source,
          payload_json,
          created_at
        )
        VALUES (
          @payload_id,
          @dashboard_id,
          @version,
          TIMESTAMP(@generated_at),
          @source,
          PARSE_JSON(@payload_json),
          CURRENT_TIMESTAMP()
        )
      `,
      params: {
        payload_id: crypto.randomUUID(),
        dashboard_id: normalized.dashboard_id,
        version: normalized.version,
        generated_at: normalized.generated_at,
        source: normalized.source,
        payload_json: JSON.stringify(normalized),
      },
      types: {
        payload_id: 'STRING',
        dashboard_id: 'STRING',
        version: 'STRING',
        generated_at: 'STRING',
        source: 'STRING',
        payload_json: 'STRING',
      },
    });

    return NextResponse.json({
      success: true,
      mode,
      dashboard_id: normalized.dashboard_id,
      counts: {
        views: insertedViews,
        insights: insertedInsights,
        glossary_fields: insertedGlossaryFields,
      },
    });
  } catch (error) {
    console.error('Erro ao importar dashboard docs:', error);
    return NextResponse.json(
      {
        error: 'Erro ao importar dashboard docs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
