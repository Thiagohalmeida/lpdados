// lib/fetchDocs.ts
export async function fetchDocs() {
  const res = await fetch("/api/docs");
  if (!res.ok) throw new Error("Erro ao carregar documentos");
  return res.json();
}
