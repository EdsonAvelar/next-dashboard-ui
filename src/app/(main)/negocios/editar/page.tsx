// app/negocio/editar/page.jsx
import ClientNegocioEdit from "@/components/ClientNegocioEdit";
import { getCurrentUser } from "@/lib/actions";
import { prisma } from "@/lib/prisma"; // ajuste o caminho conforme sua estrutura

export default async function NegocioEditPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getCurrentUser();

  const negocioId = searchParams.negocio_id;

  if (!negocioId) {
    return <div>Negócio não encontrado.</div>;
  }

  const rawNegocio = await prisma.negocio.findUnique({
    where: { id: Number(negocioId) },
    include: {
      consorciado: true,
      simulacoes: true,
      agendamento: true,
      fechamento: true,
      user: true,
      negocioComentario: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const negocio = rawNegocio
    ? {
        ...rawNegocio,
        valor: rawNegocio.valor ? Number(rawNegocio.valor) : 0,
        consorciado: rawNegocio.consorciado
          ? {
              ...rawNegocio.consorciado,
              email: rawNegocio.consorciado.email ?? undefined,
              whatsapp: rawNegocio.consorciado.whatsapp ?? undefined,
              endereco: rawNegocio.consorciado.endereco ?? undefined,
              complemento: rawNegocio.consorciado.complemento ?? undefined,
              cep: rawNegocio.consorciado.cep ?? undefined,
            }
          : undefined,
        fechamento: rawNegocio.fechamento
          ? {
              id: String(rawNegocio.fechamento.id),
              valor: rawNegocio.fechamento.preco_bem
                ? Number(rawNegocio.fechamento.preco_bem)
                : 0,
            }
          : undefined,
        user: rawNegocio.user ? { name: rawNegocio.user.name } : undefined,
      }
    : null;

  if (!negocio) {
    return <div>Negócio não encontrado.</div>;
  }

  const simulacoes = await prisma.simulacao.findMany({
    where: { negocioId: Number(negocioId) },
    orderBy: { dataProposta: "desc" },
    include: { consorcios: true, financiamentos: true },
  });

  // Passamos os dados do negócio para o componente cliente
  return (
    <ClientNegocioEdit
      negocio={negocio}
      user={user}
      simulacoes={simulacoes}
    />
  );
}
