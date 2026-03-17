import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-access";
import { listBigQueryTableCatalog } from "@/lib/tabelas-status-store";

export async function GET() {
  const access = await requireAdminApiAccess();

  if (!access.ok) {
    return access.response;
  }

  try {
    const items = await listBigQueryTableCatalog();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Erro ao listar catalogo de tabelas do BigQuery:", error);
    return NextResponse.json({ error: "Erro ao carregar catalogo do BigQuery" }, { status: 500 });
  }
}
