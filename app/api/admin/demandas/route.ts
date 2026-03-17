import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-access";
import { listDemandas } from "@/lib/demandas-store";
import type { Demanda, PrioridadeDemanda, StatusDemanda } from "@/types/bi-platform";

export async function GET(request: NextRequest) {
  const access = await requireAdminApiAccess();

  if (!access.ok) {
    return access.response;
  }

  try {
    const status = request.nextUrl.searchParams.get("status")?.trim().toLowerCase();
    const area = request.nextUrl.searchParams.get("area")?.trim().toLowerCase();
    const prioridade = request.nextUrl.searchParams.get("prioridade")?.trim().toLowerCase();

    let demandas = await listDemandas();

    if (status) {
      demandas = demandas.filter((item: Demanda) => item.status === status as StatusDemanda);
    }

    if (area) {
      demandas = demandas.filter((item: Demanda) => item.area.toLowerCase() === area);
    }

    if (prioridade) {
      demandas = demandas.filter((item: Demanda) => item.prioridade === prioridade as PrioridadeDemanda);
    }

    return NextResponse.json(demandas);
  } catch (error) {
    console.error("Erro ao listar demandas no admin:", error);
    return NextResponse.json({ error: "Erro ao listar demandas" }, { status: 500 });
  }
}
