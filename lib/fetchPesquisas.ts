// lib/fetchPesquisas.ts
export async function fetchPesquisas() {
  const res = await fetch("/api/pesquisas");
  if (!res.ok) throw new Error("Erro ao carregar pesquisas");
  return res.json();
}
