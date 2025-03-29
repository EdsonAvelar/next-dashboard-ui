"use client";

import React, { useMemo, useState } from "react";
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

type FormatType = "contraido" | "inteiro" | "numerico" | "porcentagem";

export interface Series {
  dataKey: string;
  fill: string;
  label: string;
}

export interface StackedChartCardProps {
  title: string;
  icon?: string;
  data: any[];
  xKey: string;
  series: Series[];
  horizontal?: boolean;
  formatType?: FormatType;
  ordered?: boolean;
  exibirZerados?: boolean;
}

export default function StackedBarChartComponent({
  title,
  icon,
  data,
  xKey,
  series,
  horizontal = false,
  formatType = "numerico",
  ordered = false,
  exibirZerados = false,
}: StackedChartCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  // Define tamanhos
  const chartHeight = isFullscreen ? "h-[800px]" : horizontal ? "h-96" : "h-64";
  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-white p-4 overflow-auto shadow-md"
    : "bg-white rounded-lg p-4";

  // Processa os dados
  const processedData = useMemo(() => {
    let arr = data.map((item) => ({ ...item }));
    // Se não deve exibir vendedores com todos os valores zerados, filtra os itens
    if (!exibirZerados) {
      arr = arr.filter((item) => {
        const total = series.reduce(
          (acc, s) => acc + Number(item[s.dataKey]),
          0
        );
        return total !== 0;
      });
    }
    // Se for ordenado, ordena com base no primeiro série
    if (ordered && series.length > 0) {
      arr = [...arr].sort(
        (a, b) => Number(b[series[0].dataKey]) - Number(a[series[0].dataKey])
      );
    }
    return arr;
  }, [data, ordered, series, exibirZerados]);

  const checkZero = (value: string) => {
    if (value === "0.00") return "";
    return value;
  };

  const valueFormatter = (value: number) => {
    if (formatType === "contraido") {
      return formatNumberShort(value);
    } else if (formatType === "inteiro") {
      return checkZero(value.toFixed(0));
    } else if (formatType === "porcentagem") {
      return `${value.toFixed(0)} %`;
    } else if (formatType === "numerico") {
      return checkZero(value.toFixed(2));
    }
    return value.toString();
  };

  return (
    <div className={containerClasses}>
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">{title}</h1>
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

      <div
        className={isFullscreen ? "w-full h-[90%]" : `w-full ${chartHeight}`}
      >
        <ResponsiveContainer
          width="100%"
          height={isFullscreen ? "100%" : 450}
        >
          <BarChart
            stackOffset="expand"
            layout={horizontal ? "vertical" : "horizontal"}
            data={processedData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: horizontal ? 20 : 50,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ccc"
            />
            {horizontal ? (
              <>
                <YAxis
                  type="category"
                  dataKey={xKey}
                  tickMargin={10}
                  axisLine={false}
                  width={150}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickFormatter={(value: number) => formatNumberShort(value)}
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
                />
                <YAxis
                  type="number"
                  axisLine={false}
                  tickFormatter={(value: number) => formatNumberShort(value)}
                />
              </>
            )}
            <Tooltip
              contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
            />
            <Legend
              verticalAlign="top"
              align="center"
              layout="horizontal"
              wrapperStyle={{ marginBottom: 40, paddingBottom: 30 }}
            />
            {series.map((serie) => (
              <Bar
                key={serie.dataKey}
                dataKey={serie.dataKey}
                stackId="a"
                fill={serie.fill}
              >
                {processedData.map((_, index) => (
                  <Cell key={`${serie.dataKey}-${index}`} />
                ))}
                <LabelList
                  dataKey={serie.dataKey}
                  position={horizontal ? "right" : "top"}
                  formatter={valueFormatter}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
