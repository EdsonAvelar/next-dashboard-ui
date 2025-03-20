"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function PropostasChart({
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate: Date;
}) {
  // 1. Obtém todos os vendedores com a permissão "time_comercial"
  const vendedores = await getTimeComercialVendedores();

  // 2. Agrupa as propostas (do modelo Simulacao) por vendedor, filtrando pelo campo dataProposta
  const grouped = await prisma.simulacao.groupBy({
    by: ["userId"],
    _count: { _all: true },
    where: {
      dataProposta: {
        not: null,
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  // 3. Cria um mapa para associar cada vendedor (userId) à contagem de propostas
  const groupedMap: Record<number, number> = {};
  grouped.forEach((item) => {
    if (item.userId !== null) {
      groupedMap[item.userId] = item._count._all;
    }
  });

  // 4. Para cada vendedor, monta o array de dados (se não houver propostas, atribui 0)
  const data = vendedores.map((vendedor) => ({
    userId: vendedor.id,
    name: vendedor.name,
    value: groupedMap[vendedor.id] || 0,
  }));


  // 5. Calcula o total de propostas
  const totalPropostas = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="p-4">
      <BarChartComponent
        title={`${totalPropostas} Propostas`}
        data={data}
        xKey="name"
        valueKey="value"
        icon="/icons/proposals.png" // ajuste o caminho para o ícone desejado
      />
    </div>
  );
}
