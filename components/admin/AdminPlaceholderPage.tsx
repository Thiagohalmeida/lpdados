import Link from "next/link";
import { ArrowRight, Construction, LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { platformRoutes } from "@/lib/platform-config";

type AdminPlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  nextSteps: string[];
  icon: LucideIcon;
};

export function AdminPlaceholderPage({
  eyebrow,
  title,
  description,
  nextSteps,
  icon: Icon,
}: AdminPlaceholderPageProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.18em] text-blue-600">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-3 max-w-3xl text-slate-600">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-900">
              <span className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <Icon className="h-5 w-5" />
              </span>
              Area preparada para evolucao
            </CardTitle>
            <CardDescription>
              Esta pagina foi criada para reservar a operacao administrativa do novo dominio sem quebrar o fluxo atual.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            {nextSteps.map((step) => (
              <div key={step} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                {step}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Construction className="h-5 w-5" />
              Em preparacao
            </CardTitle>
            <CardDescription className="text-amber-800">
              O fluxo visual ja esta reservado. A operacao completa sera habilitada em fases seguintes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href={platformRoutes.portal}>
              <Button variant="outline" className="w-full border-amber-300 bg-white text-amber-900 hover:bg-amber-100">
                Ver portal
              </Button>
            </Link>
            <Link href={platformRoutes.help}>
              <Button variant="outline" className="w-full border-amber-300 bg-white text-amber-900 hover:bg-amber-100">
                Revisar Central de Ajuda
              </Button>
            </Link>
            <Link href={platformRoutes.newRequest}>
              <Button className="w-full bg-amber-600 hover:bg-amber-700">
                Abrir fluxo publico
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
