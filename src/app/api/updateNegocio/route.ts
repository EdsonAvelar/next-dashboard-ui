import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateNegocio } from "@/lib/actions";


export async function POST(req: Request) {
  try {
    // Lê o corpo da requisição
    const body = await req.json();

    // Valida os dados usando o schema do Zod

    const updatedNegocio = await updateNegocio(data);

    // Atualiza o negócio no banco de dados utilizando o Prisma
    // const updatedNegocio = await prisma.negocio.update({
    //   where: { id: data.id },
    //   data: {
    //     titulo: data.titulo,
    //     tipo: data.tipo,
    //     valor: data.valor,
    //   },
    // });

    return NextResponse.json({ success: true, negocio: updatedNegocio });
  } catch (error: any) {
    console.error("Erro ao atualizar o negócio:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
