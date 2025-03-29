// app/api/getConfig/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ajuste o caminho conforme sua estrutura

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json(
      { error: "Parâmetros 'key' são obrigatórios" },
      { status: 400 }
    );
  }

  try {
    const config = await prisma.config.findUnique({
      where: { key: key },
    });

    // Se não achar a configuração retorna sempre false
    if (!config) {
      return NextResponse.json({ value: false });
    }

    return NextResponse.json({ value: config.value });
  } catch (error) {
    console.error("Erro ao buscar configuração:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
