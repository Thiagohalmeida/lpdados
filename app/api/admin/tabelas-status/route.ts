import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdminApiAccess } from "@/lib/admin-access";
import { createTabelaStatus, listTabelasStatus, TabelaStatusValidationError } from "@/lib/tabelas-status-store";

export async function GET() {
  const access = await requireAdminApiAccess();

  if (!access.ok) {
    return access.response;
  }

  try {
    const items = await listTabelasStatus();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Erro ao listar tabelas_status no admin:", error);
    return NextResponse.json({ error: "Erro ao listar Saude dos Dados" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const access = await requireAdminApiAccess();

  if (!access.ok) {
    return access.response;
  }

  try {
    const body = await request.json();
    const item = await createTabelaStatus(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      const fields = error.flatten().fieldErrors;
      const firstFieldError = Object.values(fields).flat().find(Boolean);

      return NextResponse.json(
        {
          error: firstFieldError || "Dados invalidos",
          fields,
        },
        { status: 400 }
      );
    }

    if (error instanceof TabelaStatusValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Erro ao criar tabela_status:", error);
    return NextResponse.json({ error: "Erro ao criar registro de Saude dos Dados" }, { status: 500 });
  }
}
