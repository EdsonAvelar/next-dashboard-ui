"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { FechamentoStatus, formatCurrency } from "@/lib/utils";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function FechamentosModesChart({
  fromDate,
  toDate,
  modo,
}: {
  fromDate: Date;
  toDate: Date;
  modo: string;
}) {
  // 1. Obtém todos os vendedores com a permissão "time_comercial"
  const vendedores = await getTimeComercialVendedores();

  // 2. Busca os fechamentos com status "FECHADA" no intervalo,
  // incluindo o negócio para acessar preco_bem e os vendedores (para ver quem tem modo MODO_AJUDA).
  //   const fechamentos = await prisma.fechamento.findMany({
  //     where: {
  //       status: "FECHADA", // ou FechamentoStatus.FECHADA, dependendo de como está definido
  //       data_fechamento: { gte: fromDate, lte: toDate },
  //     },
  //     include: {
  //       negocio: { select: { user_id: true, preco_bem: true } },
  //       vendedores: true, // traz a relação FechamentoUser, onde consta userId e modo
  //     },
  //   });

  const fechamentos = await prisma.fechamento.findMany({
    where: {
      status: FechamentoStatus.FECHADA,
      data_fechamento: { gte: fromDate, lte: toDate },
    },
    include: {
      negocio: { select: { user_id: true } },
      vendedores: true,
    },
  });

  const groupedMap: Record<number, number> = {};
  fechamentos.forEach((fechamento) => {
    fechamento.vendedores.forEach((vend) => {
      const valor = fechamento.preco_bem ? Number(fechamento.preco_bem) : 0;
      if (vend.modo === modo) {
        const userId = vend.userId;
        groupedMap[userId] = (groupedMap[userId] || 0) + valor;
      }
    });
  });

  // 4. Para cada vendedor (com permissão), monta o array de dados.
  //    Se o vendedor não tiver vendas no modo ajuda, seu valor será 0.
  const data = vendedores.map((vendedor) => ({
    userId: vendedor.id,
    name: vendedor.name,
    value: groupedMap[vendedor.id] || 0,
  }));

  // 5. Calcula o total de vendas em modo ajuda
  const totalAjuda = data.reduce((acc, item) => acc + item.value, 0);
  const formattedTotal = formatCurrency(totalAjuda);

  return (
    <div className="p-4">
      <BarChartComponent
      title={`Vendas ${modo
        .replace(/_/g, " ")
        .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())} (${formattedTotal})`}
      data={data}
      xKey="name"
      valueKey="value"
      icon="/icons/help.png" // ajuste conforme necessário

      />
    </div>
  );
}
