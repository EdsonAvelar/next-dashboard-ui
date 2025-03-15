// app/fechamento/page.tsx
import FechamentoForm from "@/components/forms/FechamentoForm";
import { prisma } from "@/lib/prisma";
import dayjs from "@/lib/dayjs";
import { redirect } from "next/navigation";

export default async function FechamentoPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  // O id do negócio é passado via query string, exemplo: ?negocio_id=123
  const negocioId = searchParams?.negocio_id;
  if (!negocioId) {
    return <div>ID do negócio não fornecido.</div>;
  }
  const parsedNegocioId = parseInt(negocioId, 10);

  // Busca o fechamento associado ao negócio, com os relacionamentos necessários
  let fechamento = await prisma.fechamento.findFirst({
    where: { negocioId: parsedNegocioId },
    include: {
      negocio: {
        include: {
          consorciado: true,
          conjuge: true,
        },
      },
      vendedores: {
        include: { user: true },
      },
    },
  });

  let negocio = await prisma.negocio.findUnique({
    where: { id: parsedNegocioId },
  });

  // Se não existir, cria um novo fechamento com status "RASCUNHO"
  if (!fechamento && negocio) {
    fechamento = await prisma.fechamento.create({
      data: {
        negocio: { connect: { id: negocio.id } },
        status: "RASCUNHO",
      },
      include: {
        negocio: {
          include: {
            consorciado: true,
            conjuge: true,
          },
        },
        vendedores: {
          include: { user: true },
        },
      },
    });
  }


  // Dados relacionados para os selects do formulário (ex: cargos e vendedores)
  const cargos = await prisma.cargo.findMany();
  const vendedores = await prisma.user.findMany({
    select: { id: true, name: true },
  });
  const relatedData = { cargos, vendedores };

  return (
    <>
      {negocio ? (
        <div className="container mx-auto p-4">
          {/* O componente FechamentoForm é um Client Component responsável por renderizar o formulário de atualização do fechamento */}

          <FechamentoForm
            fechamento={fechamento}
            relatedData={relatedData}
            vendedores={vendedores}
          />
        </div>
      ) : (
        <div className="w-full mt-10 text-center text-gray-500">
          Erro ao tentar acessar fechamento. Negócio não encontrado.
        </div>
      )}
    </>
  );
}
