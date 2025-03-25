"use client";

import React from "react";
import { FunnelChart, Funnel, Tooltip, Cell } from "recharts";

interface StepData {
  name: string;
  value: number;
}

interface FunnelChartProps {
  steps: StepData[]; // ex: [{ name: "Oportunidades", value: 3198 }, ...]
}

export default function FunnelChartComponent({ steps }: FunnelChartProps) {
  const colorPalette = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];
  // Calcula a taxa de conversão para cada etapa.
  const data = steps.map((step, index) => {
    const color = colorPalette[index % colorPalette.length];

    if (index === 0) {
      return {
        name: step.name,
        value: step.value,
        ratio: 100,
        color,
      };
    } else {
      const prev = steps[0].value;
      const ratio = prev > 0 ? (step.value / prev) * 100 : 0;
      return {
        name: step.name,
        value: step.value,
        ratio,
        color,
      };
    }
  });

  // Define a altura total do componente (ex: 300px)
  const chartHeight = 400;
  const stepHeight = (chartHeight / data.length).toFixed(0);

  return (
    <div className="flex flex-row overflow-hidden">
      {/* Coluna de labels */}
      <div
        className="flex flex-col justify-between pr-2"
        style={{ width: "40%" }}
      >
        {data.map((step, i) => (
          <div
            key={i}
            className="flex items-center"
            style={{ height: `${stepHeight}px` }}
          >
            <span
              className="text-left text-md font-bold"
              style={{ color: step.color }}
            >
              {step.name}: {step.value} ({step.ratio.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
      {/* Coluna do gráfico */}
      <div style={{ width: "70%" }}>
        <FunnelChart
          width={500}
          height={chartHeight}
        >
          <Tooltip />
          <Funnel
            dataKey="value"
            data={data}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
              />
            ))}
          </Funnel>
        </FunnelChart>
      </div>
    </div>
  );
}
