import { uploadNegocioFile } from "@/lib/uploads";
import { basePrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  //const result = await uploadNegocioFile(formData);

  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { error: "File not found or invalid file type" },
      { status: 400 }
    );
  }

  const fileName = await uploadFileToS3(file, file.name);
  const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${key}`;
  console.log("Uploaded file URL:", fileUrl);

  return NextResponse.json({ fileName: fileName });
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
