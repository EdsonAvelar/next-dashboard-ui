// app/simulacao/page.tsx
import SimulacaoClient from "@/components/simulacoes/SimulacaoClient";
import { prisma } from "@/lib/prisma";

interface Negocio {
  id: number;
  consultor: string;
  cliente: string;
  cpf?: string;
  tipoCredito: string;
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


  if (!negocio) {
    return <div>Negócio não encontrado.</div>;
  }

  const mappedNegocio: Negocio = {
    id: negocio.id,
    consultor: negocio.consorciado?.nome,
    cliente: negocio.user?.name || "",
    tipoCredito: negocio.tipo,
  };

  return <SimulacaoClient initialNegocio={mappedNegocio} />;
}
