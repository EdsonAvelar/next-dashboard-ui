import Badge from "@/components/Badge";
import ColumnFilter from "@/components/ColumnFilter";
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


import dayjs from "@/lib/dayjs";


import AgendamentoActions from "@/components/AgendamentoActions";

function getStatus(agendamento: any) {
  // Se houver registro em agendamento.reuniao, a reunião foi realizada
  if (agendamento.reuniao) {
    return <Badge type="green">REUNIÃO REALIZADA</Badge>;
  }

  // Caso contrário, comparar data_agendado com a data atual
  const date = dayjs(agendamento.dataAgendado);
  const now = dayjs();
  const diff = date.diff(now, "day"); // se negativo, já passou

  if (date.isSame(now, "day")) {
    return <Badge type="yellow">REUNIÃO HOJE</Badge>;
  } else if (date.isSame(dayjs().add(1, "day"), "day")) {
    return <Badge type="indigo">AMANHÃ</Badge>;
  } else if (diff < 0) {
    return <Badge type="red">FALTOU</Badge>;
  } else {
    return <Badge type="blue">AGENDADO ({Math.abs(diff)} dia(s))</Badge>;
  }
}

// Definição das colunas, seguindo a mesma estrutura de negocios/lista
const columns = [
  // Checkbox

  // Proprietário
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
  },
  // Cliente
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
  },
  // Telefone
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
  // Tipo
  {
    header: "Tipo",
    accessor: "tipo",
    className: "hidden md:table-cell",
  },
  // Agendado Para
  {
    header: "Agendado Para",
    accessor: "agendadoPara",
    className: "hidden md:table-cell",
  },
  // Hora Agendamento
  {
    header: "Hora",
    accessor: "hora",
    className: "hidden md:table-cell",
  },
  // Agendado Em
  {
    header: "Agendado Em",
    accessor: "agendadoEm",
    className: "hidden md:table-cell",
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
  },
  // Ações
  { header: "Ações", accessor: "actions", className: "" },
];

export default async function AgendamentoPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  const { page, ...params } = searchParams || {};
  const p = page ? parseInt(page) : 1;

  // Usuário atual
  const user: UserProfile = await getCurrentUser();
  const isAdmin = hasRole(user, "gerente_geral");

  // Filtros
  // Se quiser filtrar por data_agendado, proprietario, etc., crie um "where" custom
  const where: Prisma.AgendamentoWhereInput = {};

  // Exemplo: se "proprietario" está em params, filtrar pelo userName do negócio
  if (params && params.proprietario) {
    where.negocio = {
      user: {
        name: { contains: params.proprietario },
      },
    };
  }

  // Se não for admin, filtrar apenas agendamentos do user atual
  if (!isAdmin && user) {
    where.negocio = { user_id: user.id };
  }

  // Paginação
  const [data, pageCount] = await prisma.$transaction([
    prisma.agendamento.findMany({
      where,
      include: {
        negocio: {
          include: {
            user: true, // Proprietário
            consorciado: true, // Cliente
          },
        },
        reuniao: true, // Se existir, reunião realizada
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { dataAgendado: "desc" },
    }),
    prisma.agendamento.count({ where }),
  ]);

  // Mapeia os dados para as linhas da tabela
  const rows = data.map((agendamento) => {
    const negocio = agendamento.negocio;
    return (
      <tr
        key={agendamento.id}
        data-rowid={agendamento.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        {/* Proprietário */}
        <td>{negocio.user?.name || <Badge type="gray">SEM DONO</Badge>}</td>

        {/* Cliente */}
        <td>
          {negocio.consorciado ? (
            <Link href={`/negocios/${negocio.id}`}>
              {negocio.consorciado.nome}
            </Link>
          ) : (
            "N/A"
          )}
        </td>

        {/* Telefone */}
        <td className="hidden md:table-cell">
          {negocio.consorciado?.telefone ? (
            <a href={`tel:${negocio.consorciado.telefone}`}>
              {negocio.consorciado.telefone}
            </a>
          ) : (
            "N/A"
          )}
        </td>

        {/* Tipo */}
        <td className="hidden md:table-cell">{negocio.tipo || "N/A"}</td>

        {/* Agendado Para */}
        <td className="hidden md:table-cell">
          {dayjs(agendamento.dataAgendado).format("DD/MM/YYYY")}
        </td>

        {/* Hora */}
        <td className="hidden md:table-cell">{agendamento.hora || "N/A"}</td>

        {/* Agendado Em */}
        <td className="hidden md:table-cell">
          {dayjs(agendamento.dataAgendamento).format("DD/MM/YYYY")}
        </td>

        {/* Status */}
        <td>{getStatus(agendamento)}</td>

        {/* Ações */}
        <td className="flex items-center gap-2 bg-blue-400 rounded-md p-2">
          {negocio.id}

          <AgendamentoActions negocioId={negocio.id} />
        </td>
      </tr>
    );
  });

  // Se quiser exibir um Select de Proprietários, Etapas, etc., para filtros
  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true },
  });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Agendamentos</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          {/* Exemplo de botões de filtro, etc. */}
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
            {/* Exemplo de FormContainer, se quiser criar novo Agendamento */}
            {/* <FormContainer
              table="agendamento"
              type="create"
            /> */}
          </div>

          {/* Se for admin, permite filtrar por proprietario */}
          {isAdmin && <ProprietarioFilterSelect users={allUsers} />}
        </div>
      </div>

      {/* LIST */}
      <Table
        columns={columns}
        rows={rows}
        selectable={true}
        // massRelatedData se desejar
      />

      {/* PAGINATION */}
      <Pagination
        page={p}
        count={pageCount}
      />
    </div>
  );
}
