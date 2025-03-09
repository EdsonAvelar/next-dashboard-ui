// app/api/currentUser/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // ajuste o caminho conforme necessário
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  // Obtém a sessão do usuário
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  try {
    // Busca o usuário pelo email (assumindo que o email é único) e inclui as roles
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { roles: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar usuário atual:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuário atual" },
      { status: 500 }
    );
  }
}
