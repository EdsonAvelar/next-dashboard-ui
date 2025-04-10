import { NextResponse } from "next/server";
import { uploadFileToCloudinary } from "@/lib/uploads";

// O Cloudinary já está configurado dentro de uploadFileToCloudinary

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { error: "File not found or invalid file type" },
      { status: 400 }
    );
  }

  try {
    // Chama a função que faz o upload e retorna a URL do arquivo salvo.
    const secureUrl = await uploadFileToCloudinary(file as Blob, "myfolder");
    console.log("Uploaded file URL:", secureUrl);
    return NextResponse.json({ secureUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao fazer upload no Cloudinary" },
      { status: 500 }
    );
  }
}
