"use server";

import { saveCroppedImageAction } from "@/lib/actions";
import { NextResponse } from "next/server";
import { toast } from "react-toastify";

export async function POST(request: Request) {
  try {
    const { croppedImage, id, database, field, filename, folder } =
      await request.json();

    const result = await saveCroppedImageAction(croppedImage, {
      id,
      database,
      field,
      filename,
      folder,
    });

    if (!result.success) {
      throw new Error(result.msg || "Falha ao salvar a imagem");
    }

    return NextResponse.json({ fileUrl: result.fileUrl });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error(error);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
