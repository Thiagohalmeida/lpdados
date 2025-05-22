export default function Hero() {
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-6xl mx-auto px-6 text-center">
      <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full inline-block mb-4">
  Site em desenvolvimento, versão 1.0
</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Central de Business Intelligence
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Democratizando o acesso aos dados, processos e análises para impulsionar decisões estratégicas em toda a empresa.
        </p>
        <a
          href="#projects"
          className="inline-block bg-blue-600 text-white text-sm md:text-base font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
        >
          Conheça nossos Projetos
        </a>
      </div>
    </section>
  );
}
