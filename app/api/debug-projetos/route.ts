// app/api/debug-projetos/route.ts
// API temporária para debug - ver estrutura real dos dados
import { NextResponse } from 'next/server';
import { getProjetosFromBigQuery } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getProjetosFromBigQuery();
    
    // Retornar dados brutos para debug
    return NextResponse.json({
      total: data.length,
      primeiro_item: data[0],
      campos_disponiveis: data[0] ? Object.keys(data[0]) : [],
      dados_completos: data
    });
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar projetos', details: error }, 
      { status: 500 }
    );
  }
}
