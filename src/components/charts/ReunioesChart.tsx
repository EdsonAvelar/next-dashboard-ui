"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function ReunioesChart({
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate: Date;
}) {
  // 1. Busca todos os vendedores ativos (ajuste os filtros conforme necessário)
  // 1. Obtém todos os vendedores com a permissão "time_comercial"
  const vendedores = await getTimeComercialVendedores();

  // 2. Agrupa as reuniões realizadas por cada vendedor dentro do intervalo (usando dataReuniao)
  const grouped = await prisma.reuniao.groupBy({
    by: ["userId"],
    _count: { _all: true },
    where: {
      dataReuniao: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  // 3. Cria um mapa para associar cada vendedor (userId) à contagem de reuniões
  const groupedMap: Record<number, number> = {};
  grouped.forEach((item) => {
    if (item.userId !== null) {
      groupedMap[item.userId] = item._count._all;
    }
  });

  // 4. Para cada vendedor, monta o array de dados, atribuindo 0 se não houver reuniões
  const data = vendedores.map((vendedor) => ({
    userId: vendedor.id,
    name: vendedor.name,
    value: groupedMap[vendedor.id] || 0,
  }));

  // 5. Calcula o total de reuniões
  const totalReunioes = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="p-4">
      <BarChartComponent
        title={`Reuniões`}
        subtitle={`${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`}
        bottomTitle={`Total de ${totalReunioes} Reuniões`}
        bottomSubtitle={`Mostra o total de reuniões realizadas por vendedor`}
        data={data}
        xKey="name"
        valueKey="value"
        icon="/icons/meeting.png" // Altere para o caminho do ícone desejado
      />
    </div>
  );
}
