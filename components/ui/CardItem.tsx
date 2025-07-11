// components/ui/CardItem.tsx
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface CardItemProps {
  title: string;
  description?: string;
  area?: string;
  link: string;
  borderColor?: string; // Ex: "border-l-blue-500"
  icon?: React.ReactNode;
}

export function CardItem({
  title,
  description,
  area,
  link,
  borderColor = "border-l-blue-500",
  icon,
}: CardItemProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md border-l-4 border-l-blue-400 hover:shadow-lg transition-all duration-300 flex flex-col h-full`}>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          {icon && (
            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              {icon}
            </span>
          )}
          {area && (
            <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold">{area}</span>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 flex-1 mb-4">{description}</p>
        )}
      </div>
      <div className="flex justify-end p-4 pt-0">
        {link ? (
          <Link href={link} target="_blank" className="text-sm font-medium text-blue-600 flex items-center gap-1 hover:underline">
            Acessar <ExternalLink size={16} />
          </Link>
        ) : (
          <span className="text-sm font-medium text-gray-400 flex items-center gap-1 cursor-not-allowed opacity-60">
            Indisponível <ExternalLink size={16} />
          </span>
        )}
      </div>
    </div>
  );
}
