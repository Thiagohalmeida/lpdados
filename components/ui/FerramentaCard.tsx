import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar } from "lucide-react";

type Ferramenta = {
  Nome: string;
  Descricao: string;
  Link: string;
  ProxAtualizacao?: string;
};

export function FerramentaCard({ item }: { item: Ferramenta }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <span className="font-bold text-lg">{item.Nome}</span>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-700 mb-4">{item.Descricao}</p>
        <div className="flex items-center justify-between">
          {item.ProxAtualizacao && (
            <Badge variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              {item.ProxAtualizacao}
            </Badge>
          )}
          <Button asChild className="ml-auto">
            <a href={item.Link} target="_blank" rel="noopener noreferrer">
              Acessar <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
