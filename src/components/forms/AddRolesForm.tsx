"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = {
  id: number;
  name: string;
};

type AddRolesFormProps = {
  userId: number;
  allRoles: Role[];
  currentRoles: Role[];
  onClose: () => void; // para fechar modal ou dropdown, se estiver usando
};

export default function AddRolesForm({
  userId,
  allRoles,
  currentRoles,
  onClose,
}: AddRolesFormProps) {
  const router = useRouter();

  // Filtra as roles que o usuário ainda não tem
  const availableRoles = allRoles.filter(
    (role) => !currentRoles.some((r) => r.id === role.id)
  );

  // Estado para armazenar as roles selecionadas
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  // Função para selecionar/deselecionar roles
  const handleSelectRole = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/roles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleIds: selectedRoles }),
      });
      if (!response.ok) {
        throw new Error("Erro ao adicionar roles");
      }
      // Sucesso: recarrega a página
      router.refresh();
      // Fecha o formulário ou modal
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Adicionar Permissões</h2>
      <div className="mb-4 text-sm text-gray-600">
        Selecione abaixo as permissões que deseja adicionar ao usuário:
      </div>
      <div className="flex flex-col gap-2 max-h-52 overflow-y-auto mb-4">
        {availableRoles.length === 0 ? (
          <p className="text-sm text-gray-500">
            Não há permissões disponíveis.
          </p>
        ) : (
          availableRoles.map((role) => (
            <label
              key={role.id}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={selectedRoles.includes(role.id)}
                onChange={() => handleSelectRole(role.id)}
              />
              <span className="text-sm">{role.name}</span>
            </label>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Salvar
        </button>
        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
