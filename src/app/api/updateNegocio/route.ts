import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Schema para validar os dados do negócio
const updateNegocioSchema = z.object({
  id: z.number(),
  titulo: z.string().min(1, { message: "Título é obrigatório" }),
  tipo: z.enum(["IMOVEL", "CARRO", "MOTO", "CAMINHAO", "TERRENO", "MAQUINARIO", "SERVICO"]),
  valor: z.number({ invalid_type_error: "Valor deve ser um número" }),
});

export async function POST(req: Request) {

  try {
    // Lê o corpo da requisição
    const body = await req.json();

    // Valida os dados usando o schema do Zod
    const data = updateNegocioSchema.parse(body);

    // Atualiza o negócio no banco de dados utilizando o Prisma
    const updatedNegocio = await prisma.negocio.update({
      where: { id: data.id },
      data: {
        titulo: data.titulo,
        tipo: data.tipo,
        valor: data.valor,
      },
    });

    return NextResponse.json({ success: true, negocio: updatedNegocio });
  } catch (error: any) {
    console.error("Erro ao atualizar o negócio:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}