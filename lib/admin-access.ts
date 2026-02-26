import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth-options";

export async function isAdminRequestAuthorized(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  return isAdminEmail(email);
}

export async function requireAdminApiAccess(): Promise<
  { ok: true; email: string } | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Nao autenticado" }, { status: 401 }),
    };
  }

  if (!isAdminEmail(email)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Sem permissao" }, { status: 403 }),
    };
  }

  return { ok: true, email };
}

