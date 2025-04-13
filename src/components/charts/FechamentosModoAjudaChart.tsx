"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { FechamentoStatus, formatCurrency } from "@/lib/utils";
import { getTimeComercialVendedores } from "@/lib/actions";

const MODO_AJUDA = "MODO_AJUDA";

export default async function FechamentosModoAjudaChart({
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate: Date;
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
  //       negocio: { select: { userId: true, preco_bem: true } },
  //       vendedores: true, // traz a relação FechamentoUser, onde consta userId e modo
  //     },
  //   });

  const fechamentos = await prisma.fechamento.findMany({
    where: {
      status: FechamentoStatus.FECHADA,
      data_fechamento: { gte: fromDate, lte: toDate },
    },
    include: {
      negocio: { select: { userId: true } },
      vendedores: true,
    },
  });

  const groupedMap: Record<number, number> = {};
  fechamentos.forEach((fechamento) => {
    fechamento.vendedores.forEach((vend) => {
      const valor = fechamento.preco_bem ? Number(fechamento.preco_bem) : 0;
      if (vend.modo === MODO_AJUDA) {
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
        // title={`Vendas Modo Ajuda (${formattedTotal})`}
        title={`Vendas no Modo Ajuda`}
        subtitle={`${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`}
        bottomTitle={`Total em vendas ${formattedTotal}`}
        bottomSubtitle={`Mostra o total de vendas no papel: Modo Ajuda`}
        data={data}
        xKey="name"
        valueKey="value"
        icon="/icons/help.png" // ajuste conforme necessário
        ordered={true} // ordena do maior para o menor
      />
    </div>
  );
}
