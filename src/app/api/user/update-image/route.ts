// app/api/user/update-image/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, avatar } = await request.json();

    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { avatar: avatar },
    });

    // Exemplo de resposta simulada:
    return NextResponse.json({
      message: "Imagem do usuário atualizada com sucesso",
      avatar,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar a imagem do usuário" },
      { status: 500 }
    );
  }
}
