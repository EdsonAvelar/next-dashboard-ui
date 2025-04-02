// app/dashboard/funcionarios/[id]/page.tsx
import { basePrisma, prisma } from "@/lib/prisma";
import { getUserProfile } from "@/lib/actions";
import SingleFuncionarioPageClient from "@/components/SingleFuncionarioPageClient";

// Função para obter os cargos (dados relacionados)
async function getRelatedData() {
  const cargos = await prisma.cargo.findMany();
  return { cargos };
}

export default async function SingleFuncionarioPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUserProfile({ id: params.id });
  // Busca todas as roles do sistema
  const allRoles = await basePrisma.role.findMany();

  const relatedData = await getRelatedData();

  return (
    <SingleFuncionarioPageClient
      user={user}
      allRoles={allRoles}
      relatedData={relatedData}
    />
  );
}
