import { NextResponse } from "next/server";
import { updateBooleanConfigAction } from "@/lib/actions";

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json();
    // Valide os dados conforme necessário

    await updateBooleanConfigAction({ key, value });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar config:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
