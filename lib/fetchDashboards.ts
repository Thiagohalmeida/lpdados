// lib/fetchDashboards.ts
export async function fetchDashboards() {
  const res = await fetch("/api/dashboards");
  if (!res.ok) throw new Error("Erro ao carregar dashboards");
  return res.json();
}
