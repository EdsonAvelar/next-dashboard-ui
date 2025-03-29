"use server";

import { prisma } from "@/lib/prisma";
import dayjs from "@/lib/dayjs";
import GroupedBarChartComponent from "./GroupedBarChartComponent";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function ConversaoAgendamentoAbsoluteChart({
  fromDate,
  toDate,
  exibirZerados,
}: {
  fromDate: Date;
  toDate: Date;
  exibirZerados: boolean;
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
    return {
      userId: vendedor.id,
      name: vendedor.name,
      faltou: countFaltou,
      realizado: countRealizados,
    };
  });

  // 3. Calcula os totais, se necessário para exibir no título
  const totalFaltou = data.reduce((acc, item) => acc + item.faltou, 0);
  const totalRealizado = data.reduce((acc, item) => acc + item.realizado, 0);
  const totalAgendamentos = totalFaltou + totalRealizado;

  return (
    <div className="p-4">
      <GroupedBarChartComponent
        title={`Conversão de Agendamentos (Total: ${totalAgendamentos})`}
        data={data}
        xKey="name"
        series={[
          { dataKey: "faltou", fill: "#ff4d4f", label: "Faltou" },
          { dataKey: "realizado", fill: "#52c41a", label: "Compareceu" },
        ]}
        horizontal={false} // ajuste para true se preferir barras horizontais
        formatType="inteiro"
        ordered={true}
        exibirZerados={exibirZerados} // Adicione a prop exibirZerados
      />
    </div>
  );
}
