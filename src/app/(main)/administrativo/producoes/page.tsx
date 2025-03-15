// app/producoes/page.tsx
import { prisma } from "@/lib/prisma";
import FormModal from "@/components/FormModal";
import FormContainer from "@/components/forms/FormContainer";
import SimpleTable, { Column } from "@/components/SimpleTable";

export default async function ProductionsPage() {
  // Busca todas as produções
  const productions = await prisma.producao.findMany({
    orderBy: { endDate: "desc" },
  });

  // Definindo as colunas da tabela
  const columns: Column[] = [
    { header: "Nome" },
    { header: "Data de Início" },
    { header: "Data de Término" },
    { header: "Ativa" },
    { header: "Ações" },
  ];

  // Montando as linhas da tabela
  const rows = productions.map((prod) => (
    <tr
      key={prod.id}
      className="border-b last:border-b-0"
    >
      <td className="px-4 py-2">{prod.name}</td>
      <td className="px-4 py-2">{prod.startDate.toLocaleDateString()}</td>
      <td className="px-4 py-2">{prod.endDate.toLocaleDateString()}</td>
      <td className="px-4 py-2">{prod.isActive ? "Sim" : "Não"}</td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-2">
          <FormModal
            table="producao"
            type="update"
            data={prod}
          />
          <FormModal
            table="producao"
            type="delete"
            id={prod.id}
          />
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-1">
        <h1 className="hidden md:block text-lg font-semibold">
          Gerenciamento de Produções
        </h1>
      </header> 

      {/* Botão de adicionar produção */}
      <div className="flex justify-end mb-4">
        <FormContainer
          table="producao"
          type="create"
        />
      </div>

      {/* Renderiza a tabela simples */}
      <SimpleTable
        columns={columns}
        rows={rows}
      />
    </div>
  );
}
