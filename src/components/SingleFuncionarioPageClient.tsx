"use client";

import ImageUpload from "@/components/ImageUpload";
import Badge from "@/components/Badge";
import AddRolesForm from "@/components/forms/AddRolesForm";
import { useState } from "react";
import ProfileForm from "./forms/ProfileForm";
import { prisma } from "@/lib/prisma";
import ImageUploadCrop from "./ImageUploadCrop";

// Precisamos transformar este componente em client para controlar o modal
// ou podemos dividir em server + client. Aqui, farei tudo em client para simplificar.

type Role = {
  id: number;
  name: string;
};

type User = {
  id: number;
  name: string;
  avatar: string;
  cargo: string | { name: string };
  telefone: string;
  email: string;
  endereco: string;
  roles: Role[];
};

export interface RelatedData {
  cargos: { id: number; name: string }[];
  tenantId: number;
}

interface SingleFuncionarioPageClientProps {
  user: User;
  allRoles: Role[];
  relatedData: RelatedData;
}

export default function SingleFuncionarioPageClient({
  user,
  allRoles,
  relatedData,
}: SingleFuncionarioPageClientProps) {
  const { tenantId } = relatedData; // Obtemos o tenantId do objeto relatedData

  const [showAddRoles, setShowAddRoles] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6 gap-4 flex flex-col">
      <div className="">
        {/* Título da seção */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Meu Perfil
        </h1>

        <div className="flex flex-col md:flex-row gap-6 ">
          {/* Coluna Esquerda (Cartão de Informações) */}
          <div className="md:w-1/3 bg-white rounded-md shadow-lg p-4">
            <div className="flex flex-col items-center gap-2">
              <div className="h-64 w-30 overflow-hidden flex items-center justify-center">
                <ImageUploadCrop
                  aspect={1}
                  id={user.id}
                  database="user"
                  field="avatar"
                  configType="avatar"
                  defaultImage={user.avatar || "/noAvatar.png"}
                  filename={`avatar_user_${user.id}`}
                  folder={`tenants/${tenantId}/avatars`} // se desejar que o arquivo seja salvo em public/avatars
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
            </div>
          </div>

          {/* Coluna Direita (Formulário de Atualização Inline) */}
          <div className="md:w-2/3 bg-white rounded-md shadow-lg p-6">
            <ProfileForm
              data={user}
              relatedData={relatedData}
            />
          </div>
        </div>
      </div>

      <div className="md:w-1/3 bg-white rounded-md shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Permissões
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Veja as permissões que este usuário possui.
        </p>
        <div className="flex flex-wrap gap-2">
          {user.roles.map((role: Role, index: number) => (
            <Badge
              key={index}
              type="blue"
            >
              {role.name}
            </Badge>
          ))}
        </div>
        <div className="py-4">
          <button
            onClick={() => setShowAddRoles(true)}
            className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Adicionar Permissões
          </button>
        </div>

        {/* Exemplo de modal simples */}
        {showAddRoles && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-md shadow-md w-[90%] sm:w-[400px]">
              <AddRolesForm
                userId={user.id}
                allRoles={allRoles}
                currentRoles={user.roles}
                onClose={() => setShowAddRoles(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
