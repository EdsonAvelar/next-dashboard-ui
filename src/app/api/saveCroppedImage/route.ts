"use server";

import { saveLocalCroppedImageAction } from "@/lib/actions";
import { NextResponse } from "next/server";
import { toast } from "react-toastify";

export async function POST(request: Request) {
  try {
    const {
      destination,
      croppedImage,
      id,
      database,
      field,
      filename,
      folder,
      configType = "system_image", // Por padrão assume que é uma imagem do sistema
    } = await request.json();

    let result = {
      success: false,
      msg: "destination não foi reconhecido",
      fileUrl: "",
    };

    if (destination === "local") {
      result = await saveLocalCroppedImageAction({
        id,
        database,
        field,
        value: croppedImage,
        filename,
        folder,
        configType,
      });
    }

    if (!result.success) {
      throw new Error(result.msg || "Falha ao processar a requisição");
    }

    return NextResponse.json({
      fileUrl: result.fileUrl,
      success: result.success,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao processar a requisição" },
      { status: 500 }
    );
  }
}
