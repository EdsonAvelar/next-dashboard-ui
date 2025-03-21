// app/reunioes/page.tsx
import Badge from "@/components/Badge";
import ColumnFilter from "@/components/ColumnFilter";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import ProprietarioFilterSelect from "@/components/ProprietarioFilterSelect";
import { getCurrentUser, UserProfile } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { hasRole } from "@/lib/user";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import dayjs from "@/lib/dayjs";
import InputSearch from "@/components/InputSearch";

// Função para calcular a diferença de tempo entre agendamento e reunião (em dias)
function calcularDiferenca(dataAgendado: Date, dataReuniao: Date): number {
  return dayjs(dataReuniao).diff(dayjs(dataAgendado), "day");
}

// Definição das colunas para a tabela de Reuniões
const columns = [
  // ID
  {
    header: <span>Cliente</span>,
    accessor: "cliente",
  },
  // Responsável pela Reunião
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Responsável</span>
        <ColumnFilter
          paramKey="responsavel"
          filterType="text"
          label="Filtrar por Responsável"
        />
      </div>
    ),
    accessor: "responsavel",
  },
  // Data do Agendamento
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Agendado Para</span>
        <ColumnFilter
          paramKey="agendadoPara"
          filterType="text"
          label="Filtrar por Data Agendada"
        />
      </div>
    ),
    accessor: "agendadoPara",
    className: "hidden md:table-cell",
  },
  // Data da Reunião
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Realizada em</span>
        <ColumnFilter
          paramKey="realizadaEm"
          filterType="text"
          label="Filtrar por Data de Realização"
        />
      </div>
    ),
    accessor: "realizadaEm",
    className: "hidden md:table-cell",
  },
  // Diferença (dias)
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Diferença (dias)</span>
        <ColumnFilter
          paramKey="diferenca"
          filterType="text"
          label="Filtrar por Diferença"
        />
      </div>
    ),
    accessor: "diferenca",
  },
  // Ações
  { header: "Ações", accessor: "actions", className: "" },
];

export default async function ReunioesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  const { page, ...params } = searchParams || {};
  const p = page ? parseInt(page) : 1;

  // Usuário atual (para filtragem, se necessário)
  const user: UserProfile = await getCurrentUser();
  const isAdmin = hasRole(user, "gerente_geral");

  // Filtros para a query de reuniões
  const where: Prisma.ReuniaoWhereInput = {};
  // Se houver parâmetro para filtrar por responsável, exemplo:
  if (params && params.responsavel) {
    where.user = {
      name: { contains: params.responsavel },
    };
  }
  // Se o usuário não for admin, opcionalmente filtrar somente reuniões do usuário logado
  if (!isAdmin && user) {
    where.user = { id: user.id };
  }

  // Busca as reuniões com seus relacionamentos
  const [data, pageCount] = await prisma.$transaction([
    prisma.reuniao.findMany({
      where,
      include: {
        agendamento: {
          include: {
            negocio: {
              include: {
                consorciado: true,
              },
            },
          },
        },
        user: true, // Responsável pela reunião
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { createdAt: "desc" },
    }),
    prisma.reuniao.count({ where }),
  ]);

  // Mapeia os dados para as linhas da tabela
  const rows = data.map((reuniao) => {
    const agendadoPara = reuniao.agendamento?.dataAgendado
      ? dayjs(reuniao.agendamento.dataAgendado).format("DD/MM/YYYY")
      : "N/A";
    const realizadaEm = reuniao.dataReuniao
      ? dayjs(reuniao.dataReuniao).format("DD/MM/YYYY")
      : "N/A";
    let diferenca = "N/A";
    if (reuniao.agendamento?.dataAgendado && reuniao.dataReuniao) {
      diferenca = calcularDiferenca(
        new Date(reuniao.agendamento.dataAgendado),
        new Date(reuniao.dataReuniao)
      ).toString();
    }
    return (
      <tr
        key={reuniao.id}
        data-rowid={reuniao.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        {/* Cliente (extraído do lead do negócio) */}
        <td>
          {reuniao.agendamento?.negocio?.consorciado?.nome || (
            <Badge type="gray">SEM CLIENTE</Badge>
          )}
        </td>
        <td>
          {reuniao.user?.name || <Badge type="gray">SEM RESPONSÁVEL</Badge>}
        </td>
        {/* Agendado Para */}
        <td className="hidden md:table-cell">{agendadoPara}</td>
        {/* Realizada em */}
        <td className="hidden md:table-cell">{realizadaEm}</td>
        {/* Diferença */}
        <td>{diferenca}</td>
        {/* Ações */}
        <td className="flex items-center gap-2">
          <Link href={`/reunioes/${reuniao.id}`}>
            <button className="btn btn-primary">Detalhes</button>
          </Link>
        </td>
      </tr>
    );
  });

  // Se desejar filtrar por proprietário, você pode buscar todos os usuários
  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true },
  });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Reuniões</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <InputSearch />
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
          </div>
          {isAdmin && <ProprietarioFilterSelect users={allUsers} />}
        </div>
      </div>

      {/* LIST */}
      <Table
        columns={columns}
        rows={rows}
        selectable={false}
      />

      {/* PAGINATION */}
      <Pagination
        page={p}
        count={pageCount}
      />
    </div>
  );
}
