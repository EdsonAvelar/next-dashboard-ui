"use server";

import { prisma } from "@/lib/prisma";
import dayjs from "@/lib/dayjs";
import StackedBarChartComponent from "./StackedBarChartComponent";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function ConversaoAgendamentoChart({
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate: Date;
}) {
  // 0. Obtém todos os agendamentos no período, incluindo a relação com Reunião
  const agendamentos = await prisma.agendamento.findMany({
    where: {
      dataAgendado: {
        gte: fromDate,
        lte: toDate,
      },
    },
    include: {
      reuniao: true,
    },
  });

  const now = dayjs();

  // Funções auxiliares usando dayjs
  const isToday = (date: dayjs.Dayjs) => date.isSame(now, "day");
  const isTomorrow = (date: dayjs.Dayjs) =>
    date.isSame(now.add(1, "day"), "day");

  // Atualiza o status localmente, sem salvar no banco
  for (const agendamento of agendamentos) {
    let newStatus = "";
    if (agendamento.reuniao) {
      newStatus = "REUNIAO_REALIZADA";
    } else {
      const dateAgendado = dayjs(agendamento.dataAgendado);
      if (isToday(dateAgendado)) {
        newStatus = "REUNIAO_HOJE";
      } else if (isTomorrow(dateAgendado)) {
        newStatus = "AMANHA";
      } else if (now.diff(dateAgendado, "day") > 0) {
        newStatus = "FALTOU";
      } else {
        newStatus = "AGENDADA";
      }
    }
    // Define apenas localmente, sem atualizar no banco
    agendamento.status = newStatus;
  }

  // 1. Obtém os vendedores com permissão "time_comercial"
  const vendedores = await getTimeComercialVendedores();

  // 2. Para cada vendedor, conta os agendamentos do array local com status FALTOU e REUNIAO_REALIZADA
  const data = vendedores.map((vendedor) => {
    const userAgends = agendamentos.filter((a) => a.userId === vendedor.id);

    const countFaltou = userAgends.filter((a) => a.status === "FALTOU").length;
    const countRealizados = userAgends.filter(
      (a) => a.status === "REUNIAO_REALIZADA"
    ).length;

    const total = countFaltou + countRealizados;
    let faltouPerc = 0;
    let realizadoPerc = 0;
    if (total > 0) {
      faltouPerc = (countFaltou / total) * 100;
      realizadoPerc = (countRealizados / total) * 100;
    }
    return {
      userId: vendedor.id,
      name: vendedor.name,
      faltou: Number(faltouPerc.toFixed(2)),
      realizado: Number(realizadoPerc.toFixed(2)),
    };
  });

  // 3. Calcula a média (opcional) de comparecimento
  const averageRealizado =
    data.reduce((acc, item) => acc + item.realizado, 0) / data.length;

  // 4. Renderiza o gráfico empilhado
  return (
    <div className="p-4">
      <StackedBarChartComponent
        title={`Conversão de Agendamentos (Média: ${averageRealizado.toFixed(2)}%)`}
        data={data}
        xKey="name"
        formatType="porcentagem"
        series={[
          { dataKey: "faltou", fill: "#ff4d4f", label: "Não Compareceu" },
          { dataKey: "realizado", fill: "#52c41a", label: "Compareceu" },
        ]}
        icon="/icons/conversion.png"
      />
    </div>
  );
}
