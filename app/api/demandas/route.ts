import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { createDemanda, listDemandas } from "@/lib/demandas-store";

export async function GET() {
  try {
    const demandas = await listDemandas();
    return NextResponse.json(demandas);
  } catch (error) {
    console.error("Erro ao listar demandas:", error);
    return NextResponse.json({ error: "Erro ao listar demandas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const demanda = await createDemanda(body);
    return NextResponse.json(demanda, { status: 201 });
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

    console.error("Erro ao criar demanda:", error);
    return NextResponse.json({ error: "Erro ao criar demanda" }, { status: 500 });
  }
}
