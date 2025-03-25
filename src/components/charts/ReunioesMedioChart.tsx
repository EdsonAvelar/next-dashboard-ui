"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { differenceInBusinessDays } from "date-fns";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function ReunioesMedioChart({
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate: Date;
}) {
  // Define "fim" como a menor data entre toDate e hoje
  const today = new Date();
  const fim = today < toDate ? today : toDate;

  // Calcula o número de dias úteis entre fromDate e fim
  let days = differenceInBusinessDays(fim, fromDate);
  if (days <= 0) days = 1;

  // 1. Obtém todos os vendedores com a permissão "time_comercial"
  const vendedores = await getTimeComercialVendedores();

  // 2. Para cada vendedor, conta as reuniões realizadas no período
  const dataPromises = vendedores.map(async (vendedor) => {
    const count = await prisma.reuniao.count({
      where: {
        userId: vendedor.id,
        dataReuniao: {
          gte: fromDate,
          lte: fim,
        },
      },
    });
    const average = count / days;
    return {
      userId: vendedor.id,
      name: vendedor.name,
      value: average,
    };
  });
  const data = await Promise.all(dataPromises);

  // 3. Exemplo de soma total das médias, se quiser exibir no título
  const totalAverage = data.reduce((acc, item) => acc + item.value, 0);

  // 4. Renderiza o gráfico
  return (
    <div className="p-4">
      <BarChartComponent
        title={`Média de Reuniões`}
        subtitle={`${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`}
        bottomTitle={`Média de reuniões da empresa: ${totalAverage.toFixed(2)} por dia`}
        bottomSubtitle={`Mostra média dos reuniões da produção ativa ( ${days} dias úteis)`}
        data={data}
        xKey="name"
        valueKey="value"
        formatType="numerico" // 2 casas decimais
        horizontal={true} // barras na horizontal
        ordered={true} // ordena do maior para o menor
        icon="/icons/meeting.png"
      />
    </div>
  );
}
