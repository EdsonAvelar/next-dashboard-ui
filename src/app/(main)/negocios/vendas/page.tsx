// app/fechamentos/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import dayjs from "@/lib/dayjs";
import Table from "@/components/Table";
import Badge from "@/components/Badge";
import ProductionSelector, {
  Production,
} from "@/components/ProductionSelector";
import { redirect } from "next/navigation";
import ProductioNav from "@/components/ProductioNav";

type Props = {
  searchParams?: {
    data_inicio?: string;
    data_fim?: string;
  };
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default async function FechamentosPage({ searchParams }: Props) {
  const { data_inicio, data_fim } = searchParams || {};

  let dataInicio: Date | undefined;
  let dataFim: Date | undefined;
  if (data_inicio) dataInicio = new Date(data_inicio);
  if (data_fim) dataFim = new Date(data_fim);

  const whereClause: any = {};
  if (dataInicio && dataFim) {
    whereClause.data_fechamento = {
      gte: dataInicio,
      lte: dataFim,
    };
  } else if (dataInicio) {
    whereClause.data_fechamento = { gte: dataInicio };
  } else if (dataFim) {
    whereClause.data_fechamento = { lte: dataFim };
  }

  // Busca os fechamentos filtrados
  const fechamentos = await prisma.fechamento.findMany({
    where: whereClause,
    include: {
      negocio: {
        include: {
          consorciado: true,
          user: true,
        },
      },
      vendedores: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { data_fechamento: "desc" },
  });

  // Busca todas as produções (para o seletor)
  const productions: Production[] = await prisma.producao.findMany({
    orderBy: { id: "asc" },
  });

  const vendasFechadas = fechamentos.filter((f) => f.status === "FECHADA");
  const vendasRascunho = fechamentos.filter((f) => f.status === "RASCUNHO");
  const vendasCanceladas = fechamentos.filter((f) => f.status === "CANCELADA");

  const totalFechadas = vendasFechadas.reduce(
    (acc, f) => acc + (Number(f.preco_bem) || 0),
    0
  );
  const totalRascunho = vendasRascunho.reduce(
    (acc, f) => acc + (Number(f.preco_bem) || 0),
    0
  );
  const totalCanceladas = vendasCanceladas.reduce(
    (acc, f) => acc + (Number(f.preco_bem) || 0),
    0
  );

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

  function buildRows(data: typeof fechamentos) {
    return data.map((f) => (
      <tr
        key={f.id}
        data-rowid={f.id}
      >
        <td>
          <Link
            href={`/negocios/fechamento?negocio_id=${f.negocio.id}`}
            className="text-blue-600 hover:underline"
          >
            {f.negocio.consorciado?.nome || "—"}
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
  }

  const rowsFechadas = buildRows(vendasFechadas);
  const rowsRascunho = buildRows(vendasRascunho);
  const rowsCanceladas = buildRows(vendasCanceladas);

  return (
    <div className="mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="hidden md:block text-lg font-semibold">
          Gerenciamento de Fechamentos
        </h1>
      </header>

      {/* Seletor de Produção */}
      <ProductioNav
        searchParams={searchParams || {}}
        dest={"/negocios/vendas"}
      />

      {/* Seções dos grupos de vendas */}
      <section className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Vendas Fechadas
        </h2>
        <Table
          columns={columns}
          rows={rowsFechadas}
        />
        <p className="mt-4 text-lg font-bold text-green-600">
          Total: {formatCurrency(totalFechadas)}
        </p>
      </section>

      <section className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Vendas Não Concluídas
        </h2>
        <Table
          columns={columns}
          rows={rowsRascunho}
        />
        <p className="mt-4 text-lg font-bold text-yellow-600">
          Total: {formatCurrency(totalRascunho)}
        </p>
      </section>

      <section className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Vendas Canceladas
        </h2>
        <Table
          columns={columns}
          rows={rowsCanceladas}
        />
        <p className="mt-4 text-lg font-bold text-red-600">
          Total: {formatCurrency(totalCanceladas)}
        </p>
      </section>
    </div>
  );
}
