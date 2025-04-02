import { importLeadsAction } from "@/lib/actions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    console.log("post api  ", request.body);
    // Extrai os dados enviados na requisição (esperando um JSON com a chave "leads")
    const { leads } = await request.json();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }



    if (!leads) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Chama a server action para processar os leads
    const result = await importLeadsAction(leads, Number(session.user.id));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao importar leads:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
