import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { tenantStorage } from "./tenantStorage";

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

  if (token && token.tenantId) {
    // Usa o AsyncLocalStorage para definir o tenantId para toda a requisição
    // Como o middleware é executado antes que a requisição chegue aos endpoints,
    // precisamos envolver a execução da request com o contexto do tenant.
    // Em ambientes do Next.js, o AsyncLocalStorage funciona na camada do Node (não no edge).
    tenantStorage.enterWith({ tenantId: Number(token.tenantId) });
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)"],
};
