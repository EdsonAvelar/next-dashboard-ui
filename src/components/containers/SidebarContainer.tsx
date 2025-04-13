import React from "react";
import Sidebar from "../Sidebar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function SidebarContainer() {
  const session = await getServerSession(authOptions);
  //   const user = session?.user ?? null;

  if (!session || !session.user?.email) {
    return <div>Sessão não encontrada</div>;
  }

  // Busca o usuário pelo email (assumindo que o email é único) e inclui as roles
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { roles: true },
  });

  // Aqui você pode tratar se o user for null (ex: redirecionar ou exibir um fallback)
  if (!user) {
    return <div>Usuário não encontrado</div>;
  }

  return <Sidebar user={user} />;
}
