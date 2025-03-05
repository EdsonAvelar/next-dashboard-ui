import Badge from "@/components/Badge";
import ColumnFilter from "@/components/ColumnFilter";
import FormContainer from "@/components/forms/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Info</span>
        {/* Botão de filtro */}
        <ColumnFilter
          paramKey="info"
          filterType="text"
          label="Filtrar por info ID"
        />
      </div>
    ),
    accessor: "info",
    className: "",
  },
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Nome</span>
        {/* Botão de filtro */}
        <ColumnFilter
          paramKey="name"
          filterType="text"
          label="Filtrar por Teacher ID"
        />
      </div>
    ),
    accessor: "name",
    className: "hidden md:table-cell",
  },
  {
    header: (
      <div className="flex items-center gap-2">
        <span>E-mail</span>
        {/* Botão de filtro */}
        <ColumnFilter
          paramKey="cargo"
          filterType="text"
          label="Filtrar por Subjects ID"
        />
      </div>
    ),
    accessor: "email",
    className: "hidden md:table-cell",
  },
  { header: "Cargo", accessor: "cargo", className: "hidden md:table-cell" },
  {
    header: "permissoes",
    accessor: "roles",
    className: "hidden lg:table-cell",
  },
  { header: "Criação", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "createdAt", className: "" },
];

const Funcionarios = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string } | undefined;
}) => {
  const { page, ...params } = searchParams || {};
  const p = page ? parseInt(page) : 1;

  const where: Prisma.UserWhereInput = {};

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        switch (key) {
          case "name":
            where.name = {
              contains: params.teacherId,
            };
            break;
        }
      }
    }
  }

  const [data, pagecount] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      include: { roles: true, cargo: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.user.count({ where }),
  ]);

  // Pré-renderiza as linhas no servidor
  const rows = data.map((item) => (
    <tr
      key={item.id}
      data-rowid={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sn hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.avatar || "/noAvatar.png"}
          alt={item.name}
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.name}</td>
      <td className="hidden md:table-cell">{item.email}</td>
      <td className="hidden md:table-cell">{item.cargo?.name}</td>
      <td className="hidden md:table-cell">
        {item.roles.map((role, idx) => (
          <Badge
            key={idx}
            type="green"
          >
            {role.name}
          </Badge>
        ))}
      </td>
      <td className="hidden md:table-cell">{item.createdAt.toDateString()}</td>

      <td className="flex items-center gap-2">
        <FormContainer
          table="user"
          type="update"
          data={item}
          id={parseInt(item.id.toString())}
        />
        <Link href={`/administrativo/funcionario/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
            <Image
              src="/view.png"
              alt=""
              width={16}
              height={16}
            />
          </button>
        </Link>

        <FormContainer
          table="user"
          type="delete"
          id={parseInt(item.id.toString())}
        />
      </td>
    </tr>
  ));

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 shadow-lg ">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Funcionários Ativos
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-ebd">
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
                alt="filter"
                width={14}
                height={14}
              />
            </button>
            {/* {role === "admin" && ( */}
            <FormContainer
              table="user"
              type="create"
            />
            {/* )} */}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table
        columns={columns}
        rows={rows}
        selectable={true}
      />
      {/* PAGINATION */}
      <Pagination
        page={p}
        count={pagecount}
      />
    </div>
  );
};

export default Funcionarios;
