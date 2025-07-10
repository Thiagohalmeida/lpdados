export const fetchPesquisas = async () => {
  const res = await fetch('/api/pesquisas');
  if (!res.ok) throw new Error('Erro ao buscar pesquisas');
  return res.json();
};
