import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdminApiAccess } from "@/lib/admin-access";
import { deleteTabelaStatus, updateTabelaStatus } from "@/lib/tabelas-status-store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await requireAdminApiAccess();

  if (!access.ok) {
    return access.response;
  }

  try {
    const body = await request.json();
    const { id } = await params;
    const item = await updateTabelaStatus(id, body);

    if (!item) {
      return NextResponse.json({ error: "Registro nao encontrado" }, { status: 404 });
    }

    return NextResponse.json(item);
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

    console.error("Erro ao atualizar tabela_status:", error);
    return NextResponse.json({ error: "Erro ao atualizar registro de Saude dos Dados" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await requireAdminApiAccess();

  if (!access.ok) {
    return access.response;
  }

  try {
    const { id } = await params;
    const removed = await deleteTabelaStatus(id);

    if (!removed) {
      return NextResponse.json({ error: "Registro nao encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar tabela_status:", error);
    return NextResponse.json({ error: "Erro ao deletar registro de Saude dos Dados" }, { status: 500 });
  }
}
