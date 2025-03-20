// app/negocio/editar/page.jsx
import ClientNegocioEdit from "@/components/ClientNegocioEdit";
import { prisma } from "@/lib/prisma"; // ajuste o caminho conforme sua estrutura


export default async function NegocioEditPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const negocioId = searchParams.negocio_id;

  if (!negocioId) {
    return <div>Negócio não encontrado.</div>;
  }

  const rawNegocio = await prisma.negocio.findUnique({
    where: { id: Number(negocioId) },
    include: {
      consorciado: true,
      // atividades: true,
      simulacoes: true,
      agendamento: true,
      fechamento: true,
      user: true,
    },
  });

  const negocio = rawNegocio
    ? {
        ...rawNegocio,
        valor: rawNegocio.valor ? Number(rawNegocio.valor) : 0,
        fechamento: rawNegocio.fechamento
          ? {
              id: String(rawNegocio.fechamento.id),
              valor: rawNegocio.fechamento.preco_bem
                ? Number(rawNegocio.fechamento.preco_bem)
                : 0,
            }
          : undefined,
      }
    : null;

  if (!negocio) {
    return <div>Negócio não encontrado.</div>;
  }

  // Passamos os dados do negócio para o componente cliente
  return <ClientNegocioEdit negocio={negocio} />;
}
