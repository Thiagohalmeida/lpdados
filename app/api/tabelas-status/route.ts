import { NextResponse } from "next/server";
import { listTabelasStatus } from "@/lib/tabelas-status-store";

export async function GET() {
  try {
    const items = await listTabelasStatus({ activeOnly: true });
    const timestamps = items
      .map((item) => item.ultima_atualizacao)
      .filter((value): value is string => Boolean(value))
      .map((value) => new Date(value))
      .filter((value) => !Number.isNaN(value.getTime()));
    const lastRealUpdate =
      timestamps.length > 0
        ? new Date(Math.max(...timestamps.map((value) => value.getTime()))).toISOString()
        : undefined;

    return NextResponse.json({
      items,
      fetchedAt: new Date().toISOString(),
      lastRealUpdate,
    });
  } catch (error) {
    console.error("Erro ao listar tabelas_status:", error);
    return NextResponse.json({ error: "Erro ao listar Saude dos Dados" }, { status: 500 });
  }
}
