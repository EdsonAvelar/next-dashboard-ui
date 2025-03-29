"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function AgendamentosChart({
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

  // 2. Agrupa os agendamentos por vendedor, filtrando pelo campo dataAgendamento
  const grouped = await prisma.agendamento.groupBy({
    by: ["userId"],
    _count: { _all: true },
    where: {
      dataAgendado: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  // 3. Cria um mapa que associa cada vendedor (userId) à contagem de agendamentos
  const groupedMap: Record<number, number> = {};
  grouped.forEach((item) => {
    if (item.userId !== null) {
      groupedMap[item.userId] = item._count._all;
    }
  });

  // 4. Para cada vendedor, monta o array de dados, atribuindo 0 se não houver agendamentos
  const data = vendedores.map((vendedor) => ({
    userId: vendedor.id,
    name: vendedor.name,
    value: groupedMap[vendedor.id] || 0,
  }));

  // 5. Calcula o total de agendamentos
  const totalAgendamentos = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="p-4">
      <BarChartComponent
        title={`Agendamentos`}
        subtitle={`${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`}
        bottomTitle={`Total de ${totalAgendamentos} Oportunidades`}
        bottomSubtitle={`Mostra o total de agendamentos criadas por vendedor`}
        data={data}
        xKey="name"
        valueKey="value"
        icon="/icons/agenda.png" // Altere para o ícone desejado
        exibirZerados={exibirZerados}
      />
    </div>
  );
}
