// pages/api/currentUser.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // ajuste o caminho conforme sua estrutura
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Obtém a sessão do usuário
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  try {
    // Busca o usuário pelo email (assumindo que email é único) e inclui as roles
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { roles: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Erro ao buscar usuário atual:", error);
    return res.status(500).json({ error: "Erro ao buscar usuário atual" });
  }
}
