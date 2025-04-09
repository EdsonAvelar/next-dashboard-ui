import { uploadNegocioFile } from "@/lib/actions";
import { basePrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await uploadNegocioFile(formData);
  return NextResponse.json(result);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const negocioId = searchParams.get("negocioId");
  if (!negocioId) {
    return NextResponse.json({ uploads: [] });
  }
  // Busca os uploads deste negócio
  const uploads = await basePrisma.upload.findMany({
    where: { negocioId: Number(negocioId) },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ uploads });
}
