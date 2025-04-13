"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function AprovacoesChart({
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

    // Para cada produção, conta as aprovações cuja data_aprovacao esteja dentro do período da produção.
    // Se userId estiver definido, filtra também pelas aprovações cujo negócio possua esse userId.
    const data = await Promise.all(
      producoes.map(async (producao) => {
        const count = await prisma.aprovacao.count({
          where: {
            data_aprovacao: {
              gte: producao.startDate,
              lte: producao.endDate,
            },
            ...(userId ? { negocio: { userId } } : {}),
          },
        });
        return {
          userId: null,
          name: producao.name,
          value: count,
        };
      })
    );

    const totalAprovacoes = data.reduce((acc, item) => acc + item.value, 0);

    return (
      <div className="p-4">
        <BarChartComponent
          title="Aprovações por Produção"
          subtitle="Filtrado pelas datas de cada produção"
          bottomTitle={`Total de ${totalAprovacoes} Aprovações`}
          bottomSubtitle="Aprovações agrupadas por produção"
          data={data}
          xKey="name"
          valueKey="value"
          icon="/icons/approval.png"
          exibirZerados={exibirZerados}
        />
      </div>
    );
  } else {
    // Lógica atual: agrupa as aprovações por vendedor
    // 1. Obtém todos os vendedores com a permissão "time_comercial"
    const vendedores = await getTimeComercialVendedores();

    // 2. Busca todas as aprovações dentro do intervalo, incluindo o negócio para pegar o userId
    const aprovas = await prisma.aprovacao.findMany({
      where: {
        data_aprovacao: {
          gte: fromDate,
          lte: toDate,
        },
        ...(userId ? { negocio: { userId } } : {}),
      },
      include: {
        negocio: {
          select: {
            userId: true,
          },
        },
      },
    });

    // 3. Agrupa as aprovações por userId (obtido do negócio)
    const groupedMap: Record<number, number> = {};
    aprovas.forEach((aprovacao) => {
      const id = aprovacao.negocio.userId;
      if (id !== null) {
        groupedMap[id] = (groupedMap[id] || 0) + 1;
      }
    });

    // 4. Para cada vendedor, monta o array de dados (atribui 0 se não houver aprovações)
    const data = vendedores.map((vendedor) => ({
      userId: vendedor.id,
      name: vendedor.name,
      value: groupedMap[vendedor.id] || 0,
    }));

    // 5. Calcula o total de aprovações
    const totalAprovacoes = data.reduce((acc, item) => acc + item.value, 0);

    return (
      <div className="p-4">
        <BarChartComponent
          title="Aprovações"
          subtitle={`${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`}
          bottomTitle={`Total de ${totalAprovacoes} Aprovações`}
          bottomSubtitle={`Mostra o total de aprovações por vendedor`}
          data={data}
          xKey="name"
          valueKey="value"
          icon="/icons/approval.png"
          exibirZerados={exibirZerados}
        />
      </div>
    );
  }
}
