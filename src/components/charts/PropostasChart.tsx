"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function PropostasChart({
  fromDate,
  toDate,
  exibirZerados,
  type,
  userId,
}: {
  fromDate: Date;
  toDate: Date;
  exibirZerados: boolean;
  type?: "producao_atual" | "producao_anual" | "producao_total";
  userId?: number;
}) {
  if (type === "producao_total") {
    // Busca todas as produções (cada uma contém startDate e endDate)
    const producoes = await prisma.producao.findMany({
      // Adicione filtros extras, se necessário (ex: tenantId)
    });

    // Para cada produção, conta as propostas (simulações) cuja dataProposta
    // esteja dentro do período da produção
    const data = await Promise.all(
      producoes.map(async (producao) => {
        const count = await prisma.simulacao.count({
          where: {
            dataProposta: {
              gte: producao.startDate,
              lte: producao.endDate,
            },
            ...(userId ? { userId } : {}),
          },
        });
        return {
          userId: null,
          name: producao.name,
          value: count,
        };
      })
    );

    const totalPropostas = data.reduce((acc, item) => acc + item.value, 0);

    return (
      <div className="p-4">
        <BarChartComponent
          title="Propostas por Produção"
          subtitle="Filtrado pelas datas de cada produção"
          bottomTitle={`Total de ${totalPropostas} Propostas`}
          bottomSubtitle="Propostas agrupadas por produção"
          data={data}
          xKey="name"
          valueKey="value"
          icon="/icons/proposals.png"
          exibirZerados={exibirZerados}
        />
      </div>
    );
  } else {
    // Lógica atual: Obtém todos os vendedores com a permissão "time_comercial"
    const vendedores = await getTimeComercialVendedores();

    // Agrupa as propostas (do modelo Simulacao) por vendedor, filtrando pelo campo dataProposta
    const grouped = await prisma.simulacao.groupBy({
      by: ["userId"],
      _count: { _all: true },
      where: {
        dataProposta: {
          not: null,
          gte: fromDate,
          lte: toDate,
        },
        ...(userId ? { userId } : {}),
      },
    });

    // Cria um mapa para associar cada vendedor (userId) à contagem de propostas
    const groupedMap: Record<number, number> = {};
    grouped.forEach((item) => {
      if (item.userId !== null) {
        groupedMap[item.userId] = item._count._all;
      }
    });

    // Para cada vendedor, monta o array de dados (se não houver propostas, atribui 0)
    const data = vendedores.map((vendedor) => ({
      userId: vendedor.id,
      name: vendedor.name,
      value: groupedMap[vendedor.id] || 0,
    }));

    const totalPropostas = data.reduce((acc, item) => acc + item.value, 0);

    return (
      <div className="p-4">
        <BarChartComponent
          title="Propostas"
          subtitle={`${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`}
          bottomTitle={`Total de ${totalPropostas} Propostas`}
          bottomSubtitle={`Mostra o total de propostas feitas por vendedor`}
          data={data}
          xKey="name"
          valueKey="value"
          icon="/icons/proposals.png"
          exibirZerados={exibirZerados}
        />
      </div>
    );
  }
}
