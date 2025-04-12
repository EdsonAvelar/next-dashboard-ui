import {
  uploadFileToCloudinary,
  uploadFileToS3,
  uploadNegocioToLocal,
} from "@/lib/uploads";
import { basePrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  const destination = formData.get("destination") as String;
  const negocioId = formData.get("negocioId")
    ? Number(formData.get("negocioId"))
    : undefined;
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { error: "File not found or invalid file type" },
      { status: 400 }
    );
  }

  const filename = (file as File).name;
  let result;

  if (destination === "aws" && file) {
    result = await uploadFileToS3(file, filename, negocioId);
  } else if (destination === "cloudinary" && file) {
    result = await uploadFileToCloudinary(file, filename);
  } else {
    result = await uploadNegocioToLocal(formData);
  }

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
