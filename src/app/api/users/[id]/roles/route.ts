// app/api/users/[id]/roles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id, 10);
    const body = await request.json();
    const { roleIds } = body as { roleIds: number[] };

    // Faz o "connect" das roles selecionadas ao usuário
    // Assumindo que user e role estejam em relacionamento many-to-many via userOnRoles ou algo semelhante
    await prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          connect: roleIds.map((roleId) => ({ id: roleId })),
        },
      },
    });

    return NextResponse.json({ message: "Roles adicionadas com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar roles:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar roles" },
      { status: 500 }
    );
  }
}
