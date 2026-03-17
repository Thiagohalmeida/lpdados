import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdminApiAccess } from "@/lib/admin-access";
import { deleteDemanda, updateDemanda } from "@/lib/demandas-store";

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
    const demanda = await updateDemanda(id, body);

    if (!demanda) {
      return NextResponse.json({ error: "Demanda nao encontrada" }, { status: 404 });
    }

    return NextResponse.json(demanda);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Dados invalidos",
          fields: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    console.error("Erro ao atualizar demanda:", error);
    return NextResponse.json({ error: "Erro ao atualizar demanda" }, { status: 500 });
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
    const removed = await deleteDemanda(id);

    if (!removed) {
      return NextResponse.json({ error: "Demanda nao encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar demanda:", error);
    return NextResponse.json({ error: "Erro ao deletar demanda" }, { status: 500 });
  }
}
