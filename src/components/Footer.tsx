export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Área de Business Intelligence • Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
