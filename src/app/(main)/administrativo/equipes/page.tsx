// app/equipes/page.tsx
import { prisma } from "@/lib/prisma";
import TeamsBoard from "@/components/TeamsBoard";
import FormContainer from "@/components/forms/FormContainer";

export default async function EquipesPage() {
  const equipes = await prisma.equipe.findMany({
    include: {
      lider: true, // agora temos acesso aos dados do líder
      membros: true, // incluindo avatar, name, etc.
    },
    orderBy: { id: "asc" },
  });

  const usersNoTeam = await prisma.user.findMany({
    where: { equipeId: null, liderEquipe: null },
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Equipes</h1>
      <div className="mb-4">
        <FormContainer
          table="equipe"
          type="create"
        />
      </div>
      <TeamsBoard
        equipes={equipes}
        usersNoTeam={usersNoTeam}
      />
    </div>
  );
}
