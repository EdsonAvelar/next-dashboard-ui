// app/login/page.tsx
import { redirect } from "next/navigation";
import { getCsrfToken } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import LoginForm from "../../../components/LoginForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Esse é um componente servidor (não tem "use client")
export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  console.log("session.user.role", session?.user?.role);

  let homepage = "dashboard/comercial"; //await GetHomepage();

  if (session) {
    if (session.user?.role === "gerente_geral") {
      homepage = "/dashboard/geral";
    }

    if (session.user.role === "gerente_equipe") {
      homepage = "/dashboard/coordenador";
    }

    if (session.user.role === "time_comercial") {
      homepage = "/dashboard/comercial";
    }
  }

  if (session) {
    // Se estiver logado, redireciona para o dashboard/admin
    redirect(homepage);
  }

  // Busca o CSRF token. Se não for gerado, retornamos null.
  const csrfToken = await getCsrfToken();

  return (
    <LoginForm
      csrfToken={csrfToken ?? null}
      homepage={homepage}
      
    />
  );
}
