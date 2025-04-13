"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import {
  FechamentoStatus,
  formatCurrency,
  formatNumberShort,
} from "@/lib/utils";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function FechamentosChart({
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
    // Busca todas as produções (cada uma possui startDate e endDate)
    const producoes = await prisma.producao.findMany({
      // Adicione filtros extras, se necessário (ex.: tenantId)
    });

    // Para cada produção, soma o campo preco_bem dos fechamentos com status "FECHADA"
    // cuja data_fechamento esteja entre producao.startDate e producao.endDate.
    // Se userId estiver definido, aplica o filtro via negocio.userId.
    const data = await Promise.all(
      producoes.map(async (producao) => {
        console.log(producao.startDate, producao.endDate);
        const resultado = await prisma.fechamento.aggregate({
          _sum: { preco_bem: true },
          where: {
            status: "FECHADA",
            data_fechamento: {
              gte: producao.startDate,
              lte: producao.endDate,
            },
            ...(userId && {
              vendedores: { some: { userId } },
            }),
          },
        });

        // const resultado = await prisma.fechamento.aggregate({
        //   _sum: { preco_bem: true },
        //   where: {
        //     status: FechamentoStatus.FECHADA,
        //     data_fechamento: {
        //       gte: producao.startDate,
        //       lte: producao.endDate,
        //     },
        //     ...(userId && {
        //   vendedores: { some: { userId } },
        //   },
        // });
        const value = resultado._sum.preco_bem || 0;
        return {
          userId: null,
          name: producao.name,
          value,
        };
      })
    );

    const totalFechamentos = data.reduce(
      (acc, item) => acc + Number(item.value),
      0
    );
    const formattedTotal = formatCurrency(totalFechamentos);

    return (
      <div className="p-4">
        <BarChartComponent
          title="Vendas por Produção"
          subtitle="Filtrado pelas datas de cada produção"
          bottomTitle={`Total em vendas: ${formattedTotal}`}
          bottomSubtitle="Soma das vendas feitas no período de cada produção"
          data={data}
          xKey="name"
          valueKey="value"
          icon="/icons/sales.png"
          exibirZerados={exibirZerados}
        />
      </div>
    );
  } else {
    // Lógica atual: agrupa os fechamentos por vendedor e soma o campo preco_bem.
    // 1. Obtém todos os vendedores com a permissão "time_comercial"
    const vendedores = await getTimeComercialVendedores();

    // 2. Busca os fechamentos com status "FECHADA" dentro do intervalo,
    // incluindo o negócio para obter o userId.
    const fechamentos = await prisma.fechamento.findMany({
      where: {
        status: FechamentoStatus.FECHADA,
        data_fechamento: { gte: fromDate, lte: toDate },
      },
      include: {
        negocio: { select: { userId: true } },
      },
    });

    // 3. Agrupa os fechamentos por vendedor (via negócio.userId) e soma o campo preco_bem.
    const groupedMap: Record<number, number> = {};
    fechamentos.forEach((fechamento) => {
      const vendedorId = fechamento.negocio?.userId;
      if (vendedorId !== null && vendedorId !== undefined) {
        const valor = fechamento.preco_bem ? Number(fechamento.preco_bem) : 0;
        groupedMap[vendedorId] = (groupedMap[vendedorId] || 0) + valor;
      }
    });

    // 4. Para cada vendedor, monta o array de dados; se o vendedor não tiver vendas, atribui 0.
    const data = vendedores.map((vendedor) => ({
      userId: vendedor.id,
      name: vendedor.name,
      value: groupedMap[vendedor.id] || 0,
    }));

    // 5. Calcula o total de vendas.
    const totalFechamentos = data.reduce((acc, item) => acc + item.value, 0);
    const formattedTotal = formatCurrency(totalFechamentos);

    return (
      <div className="p-4">
        <BarChartComponent
          title={`Vendas`}
          subtitle={`${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`}
          bottomTitle={`Total em vendas: ${formattedTotal}`}
          bottomSubtitle={`Mostra o total de vendas feitas pelo vendedor principal`}
          data={data}
          xKey="name"
          valueKey="value"
          icon="/icons/sales.png"
          exibirZerados={exibirZerados}
        />
      </div>
    );
  }
}
