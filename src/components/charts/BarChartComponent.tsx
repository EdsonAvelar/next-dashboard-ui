"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";
import { formatNumberShort } from "@/lib/utils";

type FormatType = "contraido" | "inteiro" | "numerico";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  bottomTitle?: string;
  bottomSubtitle?: string;
  icon?: string;
  data: any[];
  xKey: string;
  valueKey: string;
  stackId?: string;
  width?: number;
  height?: number;
  horizontal?: boolean;
  formatType?: FormatType;
  ordered?: boolean;
  exibirZerados?: boolean;
}

function spacedColor(id: number | string): string {
  // Utiliza o ângulo dourado (aprox. 137.508°) para distribuir as cores
  const goldenAngle: number = 137.508;
  const numericId: number = Number(id);
  const hue: number = (numericId * goldenAngle) % 360;
  return `hsl(${hue}, 60%, 50%)`;
}

export default function BarChartComponent({
  title,
  subtitle,
  bottomTitle,
  bottomSubtitle,
  icon,
  data,
  xKey,
  valueKey,
  stackId,
  horizontal = false,
  formatType = "contraido",
  ordered = false,
  exibirZerados = true,
}: ChartCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Processa os dados, definindo cores e aplicando ordenação
  const processedData = useMemo(() => {
    // Cria uma cópia dos dados com as cores definidas
    let arr = data.map((item) => {
      if (!item.color && item.userId) {
        return { ...item, color: spacedColor(item.userId) };
      }
      return item;
    });
    // Se não deve exibir os vendedores zerados, filtra os itens cujo valor é zero
    if (!exibirZerados) {
      arr = arr.filter((item) => Number(item[valueKey]) !== 0);
    }
    // Se for ordenado, ordena do maior para o menor com base na chave de valor
    if (ordered) {
      arr = [...arr].sort((a, b) => Number(b[valueKey]) - Number(a[valueKey]));
    }
    return arr;
  }, [data, ordered, valueKey, exibirZerados]);

  const checkZero = (value: string) => {
    if (value === "0.00") return "";
    return value;
  };

  const valueFormatter = (value: number) => {
    if (formatType === "contraido") {
      return formatNumberShort(value);
    } else if (formatType === "inteiro") {
      return checkZero(value.toFixed(0));
    } else if (formatType === "numerico") {
      return checkZero(value.toFixed(2));
    }
    return value.toString();
  };

  // Define classes e tamanhos conforme o modo
  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-white p-4 overflow-auto shadow-md "
    : "bg-white rounded-lg ";

  const chartHeight = isFullscreen ? "h-[800px]" : horizontal ? "h-96" : "h-64";

  return (
    <div className={containerClasses}>
      {/* Cabeçalho do Card */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="font-sm text-neutral-400">{subtitle}</p>
        </div>
        <button
          onClick={toggleFullscreen}
          className="p-1 bg-gray-50 rounded hover:bg-gray-100"
        >
          {isFullscreen ? (
            <ArrowsPointingInIcon className="w-6 h-6" />
          ) : (
            <ArrowsPointingOutIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Gráfico Responsivo */}
      <div className={isFullscreen ? "w-full h-[90%]" : "w-full h-80"}>
        <ResponsiveContainer
          width="100%"
          height={isFullscreen ? "100%" : 300}
        >
          <BarChart
            layout={horizontal ? "vertical" : undefined}
            data={processedData}
            margin={{
              top: 20,
              right: 5,
              left: 20,
              bottom: horizontal ? 0 : 50,
            }}
          >
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#eee"
            />

            {horizontal ? (
              <>
                <YAxis
                  type="category"
                  dataKey={xKey}
                  tickMargin={10}
                  axisLine={false}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey={xKey}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  tickMargin={10}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#aaa" }}
                />
                <YAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tickFormatter={(value: number) => formatNumberShort(value)}
                  tick={{ fill: "#ccc" }}
                />
              </>
            )}

            <Tooltip
              contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
            />

            <Bar
              dataKey={valueKey}
              fill="#8884d8"
              stackId={stackId}
              radius={horizontal ? [0, 7, 7, 0] : [7, 7, 0, 0]}
            >
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || "#8884d8"}
                />
              ))}
              <LabelList
                dataKey={valueKey}
                position="top"
                formatter={valueFormatter}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-semibold">{bottomTitle || ""}</h1>
          <p className="font-sm text-neutral-400">{bottomSubtitle || ""}</p>
        </div>
      </div>
    </div>
  );
}
