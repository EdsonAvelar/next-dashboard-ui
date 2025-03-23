// app/negocios/pipeline/[proprietario_id]/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import PipelineBoard from "@/components/PipelineBoard";
import { redirect } from "next/navigation";

// import PipelineBoard from "@/components/PipelineBoard";
import dynamic from "next/dynamic";
import PipelineBoardContainer from "@/components/containers/PipelineBoardContainer";
import ProprietarioFilterSelect from "@/components/ProprietarioFilterSelect";
import FormContainer from "@/components/forms/FormContainer";
import { getTimeComercialVendedores } from "@/lib/actions";
import FormModal from "@/components/FormModal";

const PipelineBoard = dynamic(() => import("@/components/PipelineBoard"), {
  ssr: false,
});

export default async function PipelinePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  // Exemplo de checagem de usuário
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const { proprietario_id, ...params } = searchParams || {};
  const proprietario = proprietario_id ? parseInt(proprietario_id) : null;

  const user = session.user; // tipado com suas roles etc.

  // Busca as etapas do funil
  const funil = await prisma.funil.findFirst({
    where: { nome: "VENDAS" },
    include: { etapa_funils: { orderBy: { ordem: "asc" } } },
  });

  // Busca os negócios deste proprietário
  const negocios = await prisma.negocio.findMany({
    where: {
      user_id: proprietario,
      status: "ATIVO", // ajuste conforme seu schema
      funil_id: funil?.id,
    },
    include: {
      etapa_funil: true,
      consorciado: true,
    },
  });

  // Organiza os negócios por etapa
  const columns = funil?.etapa_funils.map((etapa) => {
    return {
      id: etapa.id,
      name: etapa.nome,
      negocios: negocios
        .filter((n) => n.etapa_funil?.id === etapa.id)
        .map((n) => ({
          id: n.id,
          titulo: n.titulo,
          valor: n.valor !== null ? Number(n.valor) : 0,
          cliente: n.consorciado.nome, // ajuste conforme seu schema
          updatedAt: n.updatedAt,
          tipo: n.tipo,
          telefone: n.consorciado.telefone,
          whatsapp: n.consorciado.whatsapp,
        })),
    };
  });

  if (!columns) {
    return <div>Funil não encontrado</div>;
  }

  const allUsers = await getTimeComercialVendedores();

  return (
    <div className="p-4 mt-1 z-[-10]">
      {/* <h1 className="text-2xl font-semibold mb-4">Pipeline de Negócios</h1> */}

      <div className="top-[60px] md:top-[60px] left-[10px] md:left-[80px] right-0 z-auto  flex gap-4">
        {/* <div className="hidden md:block">
          <InputSearch />
        </div> */}

        <FormContainer
          table="negocio"
          type="create"
          button={true}
          title="+Add"
        />

        <FormModal
          table="negocio"
          type="createmassive"
          button={true}
          title="++Add"
        />
        <ProprietarioFilterSelect users={allUsers} />
      </div>

      <div className="">
        <PipelineBoardContainer
          columns={columns}
          proprietarioId={+params.proprietario_id}
        />
      </div>
    </div>
  );
}
