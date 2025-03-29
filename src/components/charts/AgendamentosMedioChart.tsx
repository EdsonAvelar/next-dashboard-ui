"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { differenceInBusinessDays } from "date-fns";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function AgendamentosMedioChart({
  fromDate,
  toDate,
  exibirZerados,
}: {
  fromDate: Date;
  toDate: Date;
  exibirZerados: boolean;
}) {
  // Define "fim" como a menor data entre toDate e hoje
  const today = new Date();
  const fim = today < toDate ? today : toDate;

  // Calcula o número de dias entre fromDate e fim (garante que seja pelo menos 1)
  let days = differenceInBusinessDays(fim, fromDate);
  if (days <= 0) days = 1;

  // 1. Obtém todos os vendedores com a permissão "time_comercial"
  const vendedores = await getTimeComercialVendedores();

  // 2. Para cada vendedor, conta os agendamentos realizados no período
  const dataPromises = vendedores.map(async (vendedor) => {
    const count = await prisma.agendamento.count({
      where: {
        userId: vendedor.id,
        dataAgendado: {
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

  // 3. Calcula o total de agendamentos médios (soma dos índices individuais)
  const totalAverage = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="p-4">
      <BarChartComponent
        // title={`Média de Agendamentos ( ${days} dias úteis)`}
        title={`Média de Agendamentos`}
        subtitle={`${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`}
        bottomTitle={`Média de agendamentos da empresa: ${totalAverage.toFixed(2)} por dia`}
        bottomSubtitle={`Mostra média dos agendamentos da produção Ativa ( ${days} dias úteis)`}
        data={data}
        xKey="name"
        valueKey="value"
        formatType="numerico"
        horizontal={true}
        ordered={true}
        icon="/icons/agenda.png" // ajuste conforme necessário
        exibirZerados={exibirZerados} // Adicione a prop exibirZerados
      />
    </div>
  );
}
