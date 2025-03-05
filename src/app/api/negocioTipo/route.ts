import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cargo = await prisma.cargo.findMany();
    return NextResponse.json(cargo);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar roles" },
      { status: 500 }
    );
  }
}
