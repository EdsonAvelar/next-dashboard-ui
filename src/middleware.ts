import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { tenantStorage } from "./tenantStorage";

// Lista de permissões: cada entrada contém um padrão (regex) e um array com os cargos permitidos
const routePermissions: { pattern: RegExp; allowed: string[] }[] = [
  {
    pattern: /^\/negocios\/pipeline/, // Exemplo: apenas time_comercial pode acessar
    allowed: ["time_comercial"],
  },
  // Você pode adicionar outras regras, por exemplo:
  // {
  //   pattern: /^\/dashboard/,
  //   allowed: ["admin", "gestor", "time_comercial"],
  // },
];

export async function middleware(req: NextRequest) {
  const response = NextResponse.next();

  // Permitir acesso a rotas públicas (login e API de autenticação)
  if (
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/api/auth") ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/favicon.ico")
  ) {
    return response;
  }

  // Verifica se há token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Aqui, em vez de comparar "cargo", extraímos as roles do token.role (string separada por vírgula)
  let userRoles: string[] = [];
  if (token.role && typeof token.role === "string") {
    userRoles = token.role.split(",").map((r) => r.trim());
  }

  // Verifica as permissões da rota: se a rota corresponder a uma regra e
  // nenhuma das roles do usuário estiver permitida, redireciona para a raiz (ou outra rota de bloqueio)
  for (const rule of routePermissions) {
    if (rule.pattern.test(req.nextUrl.pathname)) {
      const hasPermission = userRoles.some((role) =>
        rule.allowed.includes(role)
      );
      // Se não tiver permissão, redireciona para a raiz
      if (!hasPermission) {
        const url = req.nextUrl.clone();
        url.pathname = "/unauthorized"; // ou outra rota de bloqueio
        return NextResponse.redirect(url);
      }
      break;
    }
  }

  // if (token && token.tenantId) {
  //   // Usa o AsyncLocalStorage para definir o tenantId para toda a requisição
  //   // Como o middleware é executado antes que a requisição chegue aos endpoints,
  //   // precisamos envolver a execução da request com o contexto do tenant.
  //   // Em ambientes do Next.js, o AsyncLocalStorage funciona na camada do Node (não no edge).
  //   tenantStorage.enterWith({ tenantId: Number(token.tenantId) });
  //   return response;
  // }

  return response;
}

export const config = {
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)"],
};
