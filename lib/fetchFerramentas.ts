// lib/fetchFerramentas.ts
export async function fetchFerramentas() {
  const res = await fetch('/api/ferramentas');
  if (!res.ok) throw new Error('Erro ao buscar ferramentas');
  return res.json();
}