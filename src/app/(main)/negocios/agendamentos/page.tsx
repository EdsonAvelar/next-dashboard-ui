"use server";

import Badge from "@/components/Badge";
import ColumnFilter from "@/components/ColumnFilter";
import Pagination from "@/components/Pagination";
import ProprietarioFilterSelect from "@/components/ui/ProprietarioFilterSelect";
import Table from "@/components/Table";
import InputSearch from "@/components/InputSearch";
import { getCurrentUser, UserProfile } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { hasRole } from "@/lib/user";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import dayjs from "@/lib/dayjs";
import AgendamentoActions from "@/components/AgendamentoActions";

// Função para definir o status do agendamento
function getStatus(agendamento: any) {
  if (agendamento.reuniao) {
    return <Badge type="green">REUNIÃO REALIZADA</Badge>;
  }
  const date = dayjs(agendamento.dataAgendado);
  const now = dayjs();
  const diff = date.diff(now, "day");
  if (date.isSame(now, "day")) {
    return <Badge type="yellow">REUNIÃO HOJE</Badge>;
  } else if (date.isSame(dayjs().add(1, "day"), "day")) {
    return <Badge type="indigo">AMANHÃ</Badge>;
  } else if (diff < 0) {
    return <Badge type="red">FALTOU</Badge>;
  } else {
    // return <Badge type="blue">AGENDADO ({Math.abs(diff)} dia(s))</Badge>;
    return <Badge type="blue">AGENDADO</Badge>;
  }
}

// Definição das colunas da tabela
const columns = [
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
  {
    header: "Tipo",
    accessor: "tipo",
    className: "hidden md:table-cell",
  },
  {
    header: "Agendado Para",
    accessor: "agendadoPara",
    className: "hidden md:table-cell",
  },
  {
    header: "Hora",
    accessor: "hora",
    className: "hidden md:table-cell",
  },
  {
    header: "Agendado Em",
    accessor: "agendadoEm",
    className: "hidden md:table-cell",
  },
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
  { header: "Ações", accessor: "actions", className: "" },
];

export default async function AgendamentoPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  const { page, ...params } = searchParams || {};
  const p = page ? parseInt(page) : 1;

  // Obtém o usuário atual
  const user: UserProfile = await getCurrentUser();
  const isAdmin = hasRole(user, "gerente_geral");

  // Monta os filtros (where) para os agendamentos
  const where: Prisma.AgendamentoWhereInput = {};

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        switch (key) {
          case "cliente":
            where.negocio = {
              ...where.negocio,
              consorciado: {
                nome: {
                  contains: params.cliente,
                },
              },
            };

            break;
          case "telefone":
            where.negocio = {
              ...where.negocio,
              consorciado: {
                telefone: {
                  contains: params.telefone,
                },
              },
            };

          case "proprietario":
            where.user = {
              name: {
                contains: params.proprietario,
              },
            };
            break;
          case "proprietario_id":
            where.user = { id: parseInt(value, 10) };
            break;

          case "status":
            where.status = { contains: params.status };
            break;
        }
      }
    }
  }

  // Se não for admin, forçar filtro pelo usuário logado
  if (!isAdmin && user) {
    where.negocio = { userId: user.id };
  }

  // Consulta os agendamentos com paginação e as relações necessárias
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
        reuniao: true, // Para exibir status de reunião
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { dataAgendamento: "desc" },
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
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-xconPurpleLight"
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
        {/* Agendado Para (data do agendamento) */}
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
        <td className="flex items-center gap-2">
          <AgendamentoActions negocioId={negocio.id} />
        </td>
      </tr>
    );
  });

  // Busca lista completa de usuários (caso precise para filtros em massa)
  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true },
  });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Agendamentos</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <InputSearch />
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-xconYellow">
              <Image
                src="/filter.png"
                alt="filter"
                width={14}
                height={14}
              />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-xconYellow">
              <Image
                src="/sort.png"
                alt="sort"
                width={14}
                height={14}
              />
            </button>
          </div>
          {isAdmin && <ProprietarioFilterSelect />}
        </div>
      </div>
      {/* Tabela */}
      <Table
        columns={columns}
        rows={rows}
        selectable={true}
        massRelatedData={{ users: allUsers }}
      />
      {/* Paginação */}
      <Pagination
        page={p}
        count={pageCount}
      />
    </div>
  );
}
