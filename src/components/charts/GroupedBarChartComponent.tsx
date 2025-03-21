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

export interface Series {
  dataKey: string;
  fill: string;
  label: string;
}

interface GroupedChartCardProps {
  title: string;
  icon?: string;
  data: any[];
  xKey: string; // campo categórico, por exemplo, "name"
  series: Series[]; // ex: [{ dataKey: "faltou", fill: "#ff4d4f", label: "Faltou" }, { dataKey: "compareceu", fill: "#52c41a", label: "Compareceu" }]
  horizontal?: boolean;
  formatType?: FormatType;
  ordered?: boolean;
}

function spacedColor(id: number | string): string {
  const goldenAngle = 137.508;
  const numericId = Number(id);
  const hue = (numericId * goldenAngle) % 360;
  return `hsl(${hue}, 60%, 50%)`;
}

export default function GroupedBarChartComponent({
  title,
  icon,
  data,
  xKey,
  series,
  horizontal = false,
  formatType = "inteiro",
  ordered = false,
}: GroupedChartCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-white p-4 overflow-auto shadow-md"
    : "bg-white rounded-lg p-4";
  // Se horizontal e não em fullscreen, usa uma altura maior para acomodar os rótulos
  const chartHeight = isFullscreen ? "h-[800px]" : horizontal ? "h-96" : "h-64";

  const processedData = useMemo(() => {
    let arr = data.map((item) => ({ ...item }));
    if (ordered && series.length > 0) {
      // Ordena com base no primeiro dataKey da série (assumindo que seja representativo)
      arr = [...arr].sort(
        (a, b) => Number(b[series[0].dataKey]) - Number(a[series[0].dataKey])
      );
    }
    return arr;
  }, [data, ordered, series]);

  const valueFormatter = (value: number) => {
    switch (formatType) {
      case "contraido":
        return formatNumberShort(value);
      case "inteiro":
        return value.toFixed(0);
      case "numerico":
        return value.toFixed(2);
      default:
        return value.toString();
    }
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
          height={isFullscreen ? "100%" : 400}
        >
          <BarChart
            data={processedData}
            layout={horizontal ? "vertical" : "horizontal"}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: horizontal ? 20 : 50,
            }}
            barCategoryGap="20%"
            // Não usamos stackOffset, para que as barras fiquem lado a lado
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
                  tickFormatter={(value: number) => valueFormatter(value)}
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
                  tickFormatter={(value: number) => valueFormatter(value)}
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
              wrapperStyle={{ marginBottom: 20 }}
            />
            {series.map((serie) => (
              <Bar
                key={serie.dataKey}
                dataKey={serie.dataKey}
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
