// lib/fetchFerramentas.ts
export async function fetchFerramentas() {
  const res = await fetch("/api/ferramentas");
  if (!res.ok) throw new Error("Erro ao carregar ferramentas");
  return res.json();
}