"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function AgendamentosChart({
  fromDate,
  toDate,
  exibirZerados,
  type,
  userId,
}: {
  fromDate: Date;
  toDate: Date;
  exibirZerados: boolean;
  type?:
    | "producao_atual"
    | "producao_anual"
    | "producao_total"
    | "producao_equipe";
  userId?: number;
}) {
  if (type === "producao_total") {
    // Busca todas as produções (cada uma já possui startDate e endDate)
    const producoes = await prisma.producao.findMany({
      // Adicione filtros se necessário (ex.: tenantId)
    });

    // Para cada produção, conta os agendamentos cuja dataAgendado esteja dentro do período
    const data = await Promise.all(
      producoes.map(async (producao) => {
        const count = await prisma.agendamento.count({
          where: {
            dataAgendado: {
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

    const totalAgendamentos = data.reduce((acc, item) => acc + item.value, 0);

    return (
      <div className="p-4">
        <BarChartComponent
          title="Agendamentos por Produção"
          subtitle="Filtrado pelas datas de cada produção"
          bottomTitle={`Total de ${totalAgendamentos} Agendamentos`}
          bottomSubtitle="Agendamentos agrupados por produção"
          data={data}
          xKey="name"
          valueKey="value"
          icon="/icons/agenda.png"
          exibirZerados={exibirZerados}
        />
      </div>
    );
  } else {
    // Lógica atual: Agendamentos agrupados por vendedor
    const vendedores = await getTimeComercialVendedores();

    const grouped = await prisma.agendamento.groupBy({
      by: ["userId"],
      _count: { _all: true },
      where: {
        dataAgendado: {
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

    const totalAgendamentos = data.reduce((acc, item) => acc + item.value, 0);

    return (
      <div className="p-4">
        <BarChartComponent
          title="Agendamentos"
          subtitle={`${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`}
          bottomTitle={`Total de ${totalAgendamentos} Agendamentos`}
          bottomSubtitle="Mostra o total de agendamentos criadas por vendedor"
          data={data}
          xKey="name"
          valueKey="value"
          icon="/icons/agenda.png"
          exibirZerados={exibirZerados}
        />
      </div>
    );
  }
}
