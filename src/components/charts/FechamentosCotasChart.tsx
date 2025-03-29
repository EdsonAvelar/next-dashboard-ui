"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { FechamentoStatus, formatNumberShort } from "@/lib/utils";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function FechamentosCotasChart({
  fromDate,
  toDate,
  exibirZerados,
}: {
  fromDate: Date;
  toDate: Date;
  exibirZerados: boolean;
}) {
  // 1. Obtém todos os vendedores com a permissão "time_comercial"
  const vendedores = await getTimeComercialVendedores();

  // 2. Busca os fechamentos com status "FECHADA" dentro do intervalo,
  // incluindo o negócio para obter o user_id.
  const fechamentos = await prisma.fechamento.findMany({
    where: {
      status: FechamentoStatus.FECHADA,
      data_fechamento: { gte: fromDate, lte: toDate },
    },
    include: {
      negocio: { select: { user_id: true } },
    },
  });

  // 3. Agrupa os fechamentos por vendedor (via negócio.user_id) e conta a quantidade de fechamentos.
  const groupedMap: Record<number, number> = {};
  fechamentos.forEach((fechamento) => {
    const userId = fechamento.negocio?.user_id;
    if (userId !== null && userId !== undefined) {
      groupedMap[userId] = (groupedMap[userId] || 0) + 1;
    }
  });

  // 4. Para cada vendedor, monta o array de dados; se o vendedor não tiver fechamentos, atribui 0.
  const data = vendedores.map((vendedor) => ({
    userId: vendedor.id,
    name: vendedor.name,
    value: groupedMap[vendedor.id] || 0,
  }));

  // 5. Calcula o total de fechamentos e formata o título.
  const totalFechamentos = data.reduce((acc, item) => acc + item.value, 0);
  const formattedTotal = formatNumberShort(totalFechamentos);

  return (
    <div className="p-4">
      <BarChartComponent
        title={`Gráfico de Cotas Fechadas(${formattedTotal})`}
        data={data}
        xKey="name"
        formatType="inteiro"
        valueKey="value"
        icon="/icons/sales.png" // ajuste para o ícone desejado
        exibirZerados={exibirZerados}
      />
    </div>
  );
}
