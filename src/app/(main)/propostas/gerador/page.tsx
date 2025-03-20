// app/simulacao/page.tsx
import SimulacaoClient from "@/components/simulacoes/SimulacaoClient";
import { getCurrentUser } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

interface Negocio {
  id: number;
  consultor: string;
  cliente: string;
  cpf?: string;
  tipoCredito: string;
  userId: number;
}

export default async function SimulacaoPage({
  searchParams,
}: {
  searchParams: { negocio_id?: string };
}) {
  const negocioId = searchParams.negocio_id;

  if (!negocioId) {
    return <div>Parâmetro negócio_id não informado.</div>;
  }

  const negocio = await prisma.negocio.findFirst({
    where: { id: Number(negocioId) },
    include: { consorciado: true, user: true },
  });

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  if (!negocio) {
    return <div>Negócio não encontrado.</div>;
  }

  const mappedNegocio: Negocio = {
    id: negocio.id,
    consultor: negocio.user?.name || "",
    cliente: negocio.consorciado?.nome || "",
    tipoCredito: negocio.tipo,
    userId: user.id,
  };

  return <SimulacaoClient initialNegocio={mappedNegocio} />;
}
