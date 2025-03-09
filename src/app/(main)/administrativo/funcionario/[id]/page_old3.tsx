// app/dashboard/funcionarios/[id]/page.tsx
import Badge from "@/components/Badge";
import ImageUpload from "@/components/ImageUpload";
import { getUserProfile } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import ProfileForm from "@/components/forms/ProfileForm";

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
  // Busca o perfil do usuário a partir do ID da URL
  const user = await getUserProfile({ id: params.id });
  // Busca os dados relacionados (ex.: cargos)
  const relatedData = await getRelatedData();

  return (
    <div className="min-h-screen bg-gray-50 p-6 gap-4 flex flex-col">
      <div className="max-w-7xl mx-auto">
        {/* Título da seção */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Meu Perfil
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Coluna Esquerda (Cartão de Informações) */}
          <div className="md:w-1/3 bg-white rounded-md shadow-sm p-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <ImageUpload
                  userId={params.id ?? ""}
                  defaultImage={user.avatar || "/noAvatar.png"}
                />
              </div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500">
                {typeof user.cargo === "object" ? user.cargo.name : user.cargo}
              </p>
            </div>
            <div className="mt-4 border-t pt-4 text-sm text-gray-600 space-y-2">
              <p>
                <span className="font-semibold">Telefone (WhatsApp): </span>
                {user.telefone}
              </p>
              <p>
                <span className="font-semibold">E-mail: </span>
                {user.email}
              </p>
              <p>
                <span className="font-semibold">Endereço: </span>
                {user.endereco}
              </p>
              {/* Exemplo de permissões (opcional) */}
              <div className="flex gap-2 flex-wrap">
                {user.roles.map((role: any, idx: number) => (
                  <Badge
                    key={idx}
                    type="blue"
                  >
                    {role.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita (Formulário de Atualização Inline) */}
          <div className="md:w-2/3 bg-white rounded-md shadow-sm p-6">
            <ProfileForm
              data={user}
              relatedData={relatedData}
            />
          </div>
        </div>
      </div>

      <div className="md:w-1/3 bg-white rounded-md shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Permissões
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Veja as permissões que este usuário possui.
        </p>
        <div className="flex flex-wrap gap-2">
          {user.roles.map((role: any, index: number) => (
            <Badge
              key={index}
              type="blue"
            >
              {role.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
