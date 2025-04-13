"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function ReunioesChart({
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

    // Para cada produção, conta as reuniões cuja dataReuniao esteja dentro do período da produção
    const data = await Promise.all(
      producoes.map(async (producao) => {
        const count = await prisma.reuniao.count({
          where: {
            dataReuniao: {
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

    const totalReunioes = data.reduce((acc, item) => acc + item.value, 0);

    return (
      <div className="p-4">
        <BarChartComponent
          title="Reuniões por Produção"
          subtitle="Filtrado pelas datas de cada produção"
          bottomTitle={`Total de ${totalReunioes} Reuniões`}
          bottomSubtitle="Reuniões agrupadas por produção"
          data={data}
          xKey="name"
          valueKey="value"
          icon="/icons/meeting.png"
          exibirZerados={exibirZerados}
        />
      </div>
    );
  } else {
    // Lógica atual: agrupa as reuniões por vendedor (userId)
    const vendedores = await getTimeComercialVendedores();

    const grouped = await prisma.reuniao.groupBy({
      by: ["userId"],
      _count: { _all: true },
      where: {
        dataReuniao: {
          gte: fromDate,
          lte: toDate,
        },
        ...(userId ? { userId } : {}),
      },
    });

    const groupedMap: Record<number, number> = {};
    grouped.forEach((item) => {
      if (item.userId !== null) {
        groupedMap[item.userId] = item._count._all;
      }
    });

    const data = vendedores.map((vendedor) => ({
      userId: vendedor.id,
      name: vendedor.name,
      value: groupedMap[vendedor.id] || 0,
    }));

    const totalReunioes = data.reduce((acc, item) => acc + item.value, 0);

    return (
      <div className="p-4">
        <BarChartComponent
          title="Reuniões"
          subtitle={`${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`}
          bottomTitle={`Total de ${totalReunioes} Reuniões`}
          bottomSubtitle="Mostra o total de reuniões realizadas por vendedor"
          data={data}
          xKey="name"
          valueKey="value"
          icon="/icons/meeting.png"
          exibirZerados={exibirZerados}
        />
      </div>
    );
  }
}
