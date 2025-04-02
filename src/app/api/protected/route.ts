// app/api/protected/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { setTenantContext } from "@/tenantStorage";

export async function GET(request: Request) {
  // Obtém a sessão do usuário autenticado
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  // Extraia o tenantId da sessão (certifique-se de que ele esteja presente)
  const tenantId = session.user.tenantId ? session.user.tenantId : null;
  if (!tenantId) {
    return NextResponse.json(
      { error: "Tenant ID não encontrado na sessão" },
      { status: 400 }
    );
  }

  // Envolve a execução com o contexto do tenant
  return await setTenantContext(tenantId, async () => {
    // Agora, qualquer consulta feita pelo prisma usará o tenantId via middleware
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  });
}
