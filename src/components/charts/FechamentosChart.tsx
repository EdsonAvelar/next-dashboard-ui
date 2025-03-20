"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { FechamentoStatus, formatCurrency, formatNumberShort } from "@/lib/utils";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function FechamentosChart({
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate: Date;
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

  // 3. Agrupa os fechamentos por vendedor (via negócio.user_id) e soma o campo preco_bem.
  const groupedMap: Record<number, number> = {};
  fechamentos.forEach((fechamento) => {
    const userId = fechamento.negocio?.user_id;
    if (userId !== null && userId !== undefined) {
      // Converte o valor para number (supondo que esteja armazenado como Decimal ou string compatível)
      const valor = fechamento.preco_bem ? Number(fechamento.preco_bem) : 0;
      groupedMap[userId] = (groupedMap[userId] || 0) + valor;
    }
  });

  // 4. Para cada vendedor, monta o array de dados; se o vendedor não tiver vendas, atribui 0.
  const data = vendedores.map((vendedor) => ({
    userId: vendedor.id,
    name: vendedor.name,
    value: groupedMap[vendedor.id] || 0,
  }));

  // 5. Calcula o total de vendas e formata para o título.
  const totalFechamentos = data.reduce((acc, item) => acc + item.value, 0);
  const formattedTotal = formatCurrency(totalFechamentos);

  return (
    <div className="p-4">
      <BarChartComponent
        title={`Vendas (${formattedTotal})`}
        data={data}
        xKey="name"
        valueKey="value"
        icon="/icons/sales.png" // ajuste para o ícone desejado
      />
    </div>
  );
}
