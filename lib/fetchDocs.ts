export const fetchDocs = async () => {
  const res = await fetch('/api/docs');
  if (!res.ok) throw new Error('Erro ao buscar documentos');
  return res.json();
};
