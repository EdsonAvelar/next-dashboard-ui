"use server";

import React from "react";
import { prisma } from "@/lib/prisma";
import FunnelChartComponent from "./FunnelChartComponent";

interface ConversaoVendasFunilProps {
  fromDate: Date;
  toDate: Date;
}

export default async function ConversaoVendasFunil({
  fromDate,
  toDate,
}: ConversaoVendasFunilProps) {
  // 1. Oportunidades: Negócios com status "ATIVO" no período
  const oportunidades = await prisma.negocio.count({
    where: {
      status: "ATIVO",
      data_criacao: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  // 2. Agendamentos: Total de agendamentos no período
  const agendamentos = await prisma.agendamento.count({
    where: {
      dataAgendado: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  // 3. Reuniões: Total de reuniões realizadas no período
  const reunioes = await prisma.reuniao.count({
    where: {
      dataReuniao: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  // 4. Propostas: Soma de registros de Proposta e Simulação (se necessário)
  const countPropostas = await prisma.simulacao.count({
    where: {
      dataProposta: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });
  const countSimulacoes = await prisma.simulacao.count({
    where: {
      dataProposta: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });
  const propostas = countPropostas + countSimulacoes;

  // 5. Aprovações: Total de aprovações no período
  const aprovacoes = await prisma.aprovacao.count({
    where: {
      data_aprovacao: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  // 6. Vendas: Total de fechamentos com status "FECHADA" no período
  const vendas = await prisma.fechamento.count({
    where: {
      status: "FECHADA",
      data_fechamento: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  // Monta o array para o funil
  const steps = [
    { name: "Oportunidades", value: oportunidades },
    { name: "Agendamentos", value: agendamentos },
    { name: "Reuniões", value: reunioes },
    { name: "Propostas", value: propostas },
    { name: "Aprovações", value: aprovacoes },
    { name: "Vendas", value: vendas },
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Funil de Conversão</h2>
      <FunnelChartComponent steps={steps} />
    </div>
  );
}
