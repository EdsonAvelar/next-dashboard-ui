// app/login/page.tsx
import { redirect } from "next/navigation";
import {  getCsrfToken } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import LoginForm from "../../../components/LoginForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { useState, useEffect } from "react";

// Esse é um componente servidor (não tem "use client")
export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    // Se estiver logado, redireciona para o dashboard/admin
    redirect("/dashboard/admin");
  }

  // Busca o CSRF token. Se não for gerado, retornamos null.
  const csrfToken = await getCsrfToken();
  return <LoginForm csrfToken={csrfToken ?? null} />;
}
