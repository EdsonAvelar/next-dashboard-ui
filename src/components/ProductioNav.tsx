import React from "react";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import ProductionSelector from "./ProductionSelector";
import Link from "next/link";
import Badge from "./Badge";

interface Production {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
}

interface DashboardHeaderProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function ProductioNav({
  searchParams,
  dest,
}: DashboardHeaderProps & { dest: string }) {
  // Se houver production_name na URL, tenta buscar essa produção
  const productionNameFromUrl = searchParams?.production_name;
  let production: Production | null = null;
  if (productionNameFromUrl) {
    production = await prisma.producao.findFirst({
      where: { name: productionNameFromUrl },
    });
  }

  // Busca a produção ativa
  const activeProduction = await prisma.producao.findFirst({
    where: { isActive: true },
  });

  // Se não houver ou não for encontrada, usa a produção ativa
  if (!production) {
    production = activeProduction;
  }

  // Busca todas as produções para o seletor
  const productions: Production[] = await prisma.producao.findMany({
    orderBy: { name: "asc" },
  });

  const prodName = production ? production.name : "Sem produção ativa";
  const startDate = production
    ? dayjs(production.startDate).format("DD/MM/YYYY")
    : "";
  const endDate = production
    ? dayjs(production.endDate).format("DD/MM/YYYY")
    : "";

  // isCurrentProduction é true somente se a produção buscada for a ativa
  const isCurrentProduction =
    production && activeProduction && production.id === activeProduction.id;


  // Define a cor do container: vermelho claro se não for a produção corrente, branco caso contrário.
  const containerBg = isCurrentProduction ? "text-blue-500" : "text-red-500";

  // Define os parâmetros para o botão "Hoje": data de hoje e production_name vazio
  const today = dayjs().format("YYYY-MM-DD");

  return (
    <div
      className={`flex items-center justify-between  p-4 rounded shadow-md mb-2`}
    >
      {/* Esquerda: Título e informações da produção */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-lime-500">Dashboard - Geral</h1>
        <span className="text-sm text-gray-500">
          Produção:{" "}
          <strong className="text-blue-700 px-2">
            {prodName} - {startDate} até {endDate}
          </strong>
          {!isCurrentProduction && (
            <Badge type="red">
              Hoje está fora do intervalo da Produção Ativa!
            </Badge>
          )}
        </span>
      </div>

      {/* Direita: Seleção de produção e botões */}
      <div className="flex items-center space-x-2">
        <ProductionSelector
          productions={productions}
          dest={dest}
        />
        {/* Botão "Hoje": redireciona com data_inicio e data_fim iguais a hoje e production_name vazio */}
        <Link
          href={`${dest}?data_inicio=${today}&data_fim=${today}&production_name=`}
          className="bg-green-500 text-white text-sm px-3 py-2 rounded hover:bg-green-600 transition"
        >
          Hoje
        </Link>
        {/* <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition">
          Mudar Produção
        </button> */}
      </div>
    </div>
  );
}
