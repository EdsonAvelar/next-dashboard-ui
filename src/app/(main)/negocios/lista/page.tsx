import Badge from "@/components/Badge";
import ColumnFilter from "@/components/ColumnFilter";
import FormModal from "@/components/FormModal";
import FormContainer from "@/components/forms/FormContainer";
import Pagination from "@/components/Pagination";
import ProprietarioFilterSelect from "@/components/ProprietarioFilterSelect";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getCurrentUser, UserProfile } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { hasRole } from "@/lib/user";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const columns = [
  // Título do Negócio
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Título</span>
        <ColumnFilter
          paramKey="title"
          filterType="text"
          label="Filtrar por Título"
        />
      </div>
    ),
    accessor: "titulo",
    className: "",
  },
  // Nome do Cliente (vindo do lead)
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Cliente</span>
        <ColumnFilter
          paramKey="cliente"
          filterType="text"
          label="Filtrar por Cliente"
        />
      </div>
    ),
    accessor: "cliente",
    className: "hidden md:table-cell",
  },
  // Telefone (vindo do lead)
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Telefone</span>
        <ColumnFilter
          paramKey="telefone"
          filterType="text"
          label="Filtrar por Telefone"
        />
      </div>
    ),
    accessor: "telefone",
    className: "hidden md:table-cell",
  },
  // Valor do Crédito
  {
    header: "Valor do Crédito",
    accessor: "valor",
    className: "hidden md:table-cell",
  },
  // Etapa (nome da etapa do funil)
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Etapa</span>
        <ColumnFilter
          paramKey="etapa"
          filterType="text"
          label="Filtrar por Etapa"
        />
      </div>
    ),
    accessor: "etapa",
    className: "hidden md:table-cell",
  },
  // Proprietário do Negócio (nome do usuário)
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Proprietário</span>
        <ColumnFilter
          paramKey="proprietario"
          filterType="text"
          label="Filtrar por Proprietário"
        />
      </div>
    ),
    accessor: "proprietario",
    className: "hidden md:table-cell",
  },
  // Origem
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Origem</span>
        <ColumnFilter
          paramKey="origem"
          filterType="text"
          label="Filtrar por Origem"
        />
      </div>
    ),
    accessor: "origem",
    className: "hidden lg:table-cell",
  },
  // Status
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Status</span>
        <ColumnFilter
          paramKey="status"
          filterType="text"
          label="Filtrar por Status"
        />
      </div>
    ),
    accessor: "status",
    className: "hidden md:table-cell",
  },
  // Criado em
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Criado em</span>
        <ColumnFilter
          paramKey="createdAt"
          filterType="text"
          label="Filtrar por Data de Criação"
        />
      </div>
    ),
    accessor: "createdAt",
    className: "hidden md:table-cell",
  },
  { header: "Actions", accessor: "actions", className: "" },
];

const Negocios = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) => {
  const { page, ...params } = searchParams || {};
  const p = page ? parseInt(page) : 1;

  const user: UserProfile = await getCurrentUser();

  const isAdmin = hasRole(user, "gerente_geral");

  // Exemplo simples de filtro – você pode aprimorar conforme a necessidade.
  const where: Prisma.NegocioWhereInput = {};
  // Aqui você pode adicionar filtros com base em params, se necessário.

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        switch (key) {
          case "title":
            where.titulo = {
              contains: params.title,
            };
            break;
          case "cliente":
            where.consorciado = {
              nome: {
                contains: params.cliente,
              },
            };

            break;
          case "telefone":
            where.consorciado = {
              telefone: {
                contains: params.telefone,
              },
            };

          case "etapa":
            where.etapa_funil = {
              nome: {
                contains: params.etapa,
              },
            };
            break;
          case "proprietario":
            where.user = {
              name: {
                contains: params.proprietario,
              },
            };
            break;
          case "origem":
            where.origem = {
              contains: params.origem,
            };
            break;
          case "proprietario_id":
            where.user = { id: parseInt(value, 10) };
            break;
        }
      }
    }
  }

  // Se o usuário não for admin, forçamos o filtro pelo id do usuário logado
  
  if (!isAdmin && user) {
    where.user = { id: user.id };
  }

  // Buscando os negócios com paginação e incluindo relações
  const [data, pagecount] = await prisma.$transaction([
    prisma.negocio.findMany({
      where,
      include: {
        consorciado: true, // para obter nome e telefone do cliente
        etapa_funil: true, // para obter o nome da etapa
        user: true, // para obter o nome do proprietário
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { data_criacao: "desc" },
    }),
    prisma.negocio.count({ where }),
  ]);

  // Mapeia os dados para as linhas da tabela
  const rows = data.map((negocio) => (
    <tr
      key={negocio.id}
      data-rowid={negocio.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      {/* Checkbox */}
      {/* <td className="p-4">
        <input
          type="checkbox"
          className="select-checkbox"
          value={negocio.id}
        />
      </td> */}
      {/* Título do Negócio */}
      <td className="">
        <Link href={`/negocios/${negocio.id}`}>
          <h1 className="text-primary font-medium">{negocio.titulo}</h1>
        </Link>
      </td>
      {/* Nome do Cliente */}
      <td className="hidden md:table-cell">
        {negocio.consorciado?.nome || "N/A"}
      </td>
      {/* Telefone do Cliente */}
      <td className="hidden md:table-cell">
        {negocio.consorciado?.telefone || "N/A"}
      </td>
      {/* Valor do Crédito */}
      <td className="hidden md:table-cell">{negocio.valor || "N/A"}</td>
      {/* Etapa do Cliente */}
      <td className="hidden md:table-cell">
        {negocio.etapa_funil?.nome || "N/A"}
      </td>
      {/* Proprietário do Negócio */}
      <td className="hidden md:table-cell">
        {negocio.user?.name || "Não Atribuído"}
      </td>
      {/* Origem */}
      <td className="hidden lg:table-cell">{negocio.origem || "N/A"}</td>
      {/* Status */}
      <td className="hidden md:table-cell">
        <Badge type="green">{negocio.status}</Badge>
      </td>
      {/* Criado em */}
      <td className="">
        {new Date(negocio.data_criacao).toLocaleDateString()}
      </td>
      {/* Actions */}
      <td className="flex items-center gap-2">
        <a href={`/administrativo/negocio/${negocio.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
            <Image
              src="/view.png"
              alt="View"
              width={16}
              height={16}
            />
          </button>
        </a>
      </td>
    </tr>
  ));

  // Buscando os dados para ações em massa:
  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true },
  });
  const allEtapas = await prisma.etapaFunil.findMany({
    select: { id: true, nome: true },
  });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Negócios</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image
                src="/filter.png"
                alt="filter"
                width={14}
                height={14}
              />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image
                src="/sort.png"
                alt="sort"
                width={14}
                height={14}
              />
            </button>
            <FormContainer
              table="negocio"
              type="create"
            />
          </div>
          {/* Adicionando o select para filtrar por Proprietário */}
          
          {isAdmin && <ProprietarioFilterSelect users={allUsers} /> }

        </div>
      </div>
      {/* LIST */}
      <Table
        columns={columns}
        rows={rows}
        selectable={true}
        massRelatedData={{ users: allUsers, etapas: allEtapas }}
      />
      {/* PAGINATION */}
      <Pagination
        page={p}
        count={pagecount}
      />
    </div>
  );
};

export default Negocios;
