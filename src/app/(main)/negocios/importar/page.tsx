// app/leads/import/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import LeadsImportClient from "@/components/LeadsImportClient";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function LeadsImportPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  // Obtém a sessão do usuário
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">
          Você precisa estar logado para acessar essa página.
        </p>
      </div>
    );
  }

  // Define o filtro de acordo com o parâmetro "proprietario_id"
  let whereFilter = {};
  if (searchParams?.proprietario_id && session.user.role == "gerente_geral") {
    // Se na URL existir o proprietario_id, filtra por ele
    whereFilter = { userId: Number(searchParams.proprietario_id) };
  } else if (session.user.role !== "gerente_geral") {
    // Se não existir e o usuário não for admin, filtra pelo id do usuário logado
    whereFilter = { userId: Number(session.user.id) };
  }
  // Se o usuário for admin e não houver proprietario_id, não aplica filtro

  // Busca os leads importados de acordo com o filtro definido
  const importedLeads = await prisma.leadImportado.findMany({
    where: whereFilter,
    orderBy: { createdAt: "desc" },
  });

  const allUsers = await getTimeComercialVendedores();

  const allEtapas = await prisma.etapaFunil.findMany({
    select: { id: true, nome: true },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Importação de Leads</h1>
      {/* Chama o componente cliente passando os leads importados */}
      <LeadsImportClient
        importedLeads={importedLeads}
        massRelatedData={{ users: allUsers, etapas: allEtapas }}
      />
    </div>
  );
}
