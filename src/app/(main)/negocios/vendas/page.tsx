// app/fechamentos/page.tsx
import Badge from "@/components/Badge";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import dayjs from "@/lib/dayjs";
import { ITEM_PER_PAGE } from "@/lib/settings";

// lib/utils.ts
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default async function FechamentosPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  const page = parseInt(searchParams?.page || "1", 10);
  const statusFilter = searchParams?.status || undefined;

  const where = statusFilter ? { status: statusFilter } : {};

  const [fechamentos, totalCount] = await prisma.$transaction([
    prisma.fechamento.findMany({
      where,
      include: {
        negocio: { include: { consorciado: true, user: true } },
        vendedores: { include: { user: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
      orderBy: { data_fechamento: "desc" },
    }),
    prisma.fechamento.count({ where }),
  ]);

  const rows = fechamentos.map((f) => (
    <tr
      key={f.id}
      data-rowid={f.id}
    >
      <td>
        <Link href={`/negocios/fechamento?negocio_id=${f.negocio.id}`}>
          {f.negocio.consorciado.nome}
        </Link>
      </td>
      <td>{f.numero_contrato || "N/A"}</td>
      <td>{f.vendedores[0]?.user?.name || "N/A"}</td>
      <td className="hidden md:table-cell">
        {f.vendedores[1]?.user?.name || "—"}
      </td>
      <td className="hidden md:table-cell">
        {f.vendedores[2]?.user?.name || "—"}
      </td>
      <td className="hidden md:table-cell">
        {f.data_fechamento
          ? dayjs(f.data_fechamento).format("DD/MM/YYYY")
          : "—"}
      </td>
      <td className="hidden md:table-cell">
        {f.data_assembleia
          ? dayjs(f.data_assembleia).format("DD/MM/YYYY")
          : "—"}
      </td>
      <td>{f.preco_bem ? formatCurrency(Number(f.preco_bem)) : "—"}</td>
      <td>
        <Badge
          type={
            f.status === "FECHADA"
              ? "green"
              : f.status === "RASCUNHO"
                ? "yellow"
                : "red"
          }
        >
          {f.status}
        </Badge>
      </td>
    </tr>
  ));

  const columns = [
    { header: "Cliente", accessor: "cliente" },
    { header: "Contrato", accessor: "contrato" },
    { header: "Vendedor", accessor: "vendedor" },
    {
      header: "Ajudante",
      accessor: "ajudante",
      className: "hidden md:table-cell",
    },
    {
      header: "Telemarketing",
      accessor: "telemarketing",
      className: "hidden md:table-cell",
    },
    {
      header: "Data Fechamento",
      accessor: "dataFechamento",
      className: "hidden md:table-cell",
    },
    {
      header: "Primeira Assembleia",
      accessor: "primeiraAssembleia",
      className: "hidden md:table-cell",
    },
    { header: "Valor", accessor: "valor" },
    { header: "Status", accessor: "status" },
  ];

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciamento de Fechamentos</h1>
        <TableSearch />
      </div>

      <div className="flex gap-2 mb-4">
        <Link
          href="?status=FECHADA"
          className="btn btn-green"
        >
          Fechadas
        </Link>
        <Link
          href="?status=RASCUNHO"
          className="btn btn-yellow"
        >
          Rascunhos
        </Link>
        <Link
          href="?status=CANCELADA"
          className="btn btn-red"
        >
          Canceladas
        </Link>
        <Link
          href="/fechamentos"
          className="btn btn-gray"
        >
          Todas
        </Link>
      </div>

      <Table
        columns={columns}
        rows={rows}
        selectable
      />

      <Pagination
        page={page}
        count={Math.ceil(totalCount / ITEM_PER_PAGE)}
      />
    </div>
  );
}
