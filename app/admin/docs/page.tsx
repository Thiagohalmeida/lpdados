'use client';
import useSWR from 'swr';

export default function DocsPage() {
  const { data, error, isLoading } = useSWR('docs', () =>
    fetch('/api/docs').then(res => res.json())
  );

  const safeData = Array.isArray(data) ? data : [];

  if (error) return <p className="text-red-500">Erro ao carregar documentos.</p>;

  return (
    <section>
      <h1>Docs & Processos</h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div>
          {safeData.map((doc: any, i: number) => (
            <div key={i}>
              <span>{doc.Processo}</span>
              <span>{doc["Área"]}</span>
              <a href={doc.Link} target="_blank" rel="noopener noreferrer">🔗</a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
