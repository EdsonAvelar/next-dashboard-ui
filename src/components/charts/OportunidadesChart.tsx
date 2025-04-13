"use server";
import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function OportunidadesChart({
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
    // Busca todas as produções (cada uma já possui startDate e endDate)
    const producoes = await prisma.producao.findMany({
      // Aqui você pode adicionar filtros adicionais, se necessário, como tenantId etc.
    });

    // Para cada produção, conta os negócios cuja data_criacao esteja dentro do período definido na produção
    const data = await Promise.all(
      producoes.map(async (producao) => {
        const count = await prisma.negocio.count({
          where: {
            data_criacao: {
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

    const totalOportunidades = data.reduce((acc, item) => acc + item.value, 0);

    return (
      <div className="p-4">
        <BarChartComponent
          title="Oportunidades por Produção"
          subtitle="Filtrado pelas datas de cada produção"
          bottomTitle={`Total de ${totalOportunidades} Oportunidades`}
          bottomSubtitle="Oportunidades agrupadas por produção"
          data={data}
          xKey="name"
          valueKey="value"
          icon="/icons/briefcase.png"
          exibirZerados={exibirZerados}
        />
      </div>
    );
  } else {
    // Lógica atual: obtém os vendedores e agrupa oportunidades por vendedor (userId)
    const vendedores = await getTimeComercialVendedores();

    const grouped = await prisma.negocio.groupBy({
      by: ["userId"],
      _count: { _all: true },
      where: {
        data_criacao: {
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

    const totalOportunidades = data.reduce((acc, item) => acc + item.value, 0);

    return (
      <div className="p-4">
        <BarChartComponent
          title="Oportunidades"
          subtitle={`${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`}
          bottomTitle={`Total de ${totalOportunidades} Oportunidades`}
          bottomSubtitle="Mostra o total de oportunidades criadas por vendedor"
          data={data}
          xKey="name"
          valueKey="value"
          icon="/icons/briefcase.png"
          exibirZerados={exibirZerados}
        />
      </div>
    );
  }
}
