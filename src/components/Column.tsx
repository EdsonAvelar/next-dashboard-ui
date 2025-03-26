"use client";

import { useDroppable } from "@dnd-kit/core";
import NegocioCard from "@/components/NegocioCard";
import { formatNumberShort } from "@/lib/utils";
import { useMemo } from "react";
import { differenceInDays } from "date-fns";
import dayjs from "@/lib/dayjs";
import { NegocioItem } from "@/lib/types";
import LazyLoadWrapper from "./LazyLoadWrapper";
import SpinIcon from "./ui/SpinIcon";

type ColumnProps = {
  column: {
    id: number;
    name: string;
    negocios: NegocioItem[];
  };
  onOpenPopover: (negocio: NegocioItem, anchor: HTMLElement) => void;
};

export default function Column({ column, onOpenPopover }: ColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id.toString(), // o "over" no PipelineBoard será over.id === column.id
  });

  // Contagem de negócios
  const itemCount = column.negocios.length;

  // Soma total dos valores da coluna
  const totalValue = column.negocios.reduce(
    (acc, negocio) => acc + (negocio.valor || 0),
    0
  );

  // Formata o valor usando sua função de abreviação (ex: "400K", "1.2M")
  const formattedTotal = formatNumberShort(totalValue);

  const style = {
    backgroundColor: isOver ? "#e0ffdd" : "",
  };

  // Calcula a diferença de dias para cada negócio
  const extendedNegocios = useMemo(() => {
    const now = dayjs();
    return column.negocios.map((negocio) => {
      const date = dayjs(negocio.updatedAt);
      return {
        ...negocio,
        daysDifference: now.diff(date, "day"),
      };
    });
  }, [column.negocios]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-72 min-w-[18rem] bg-gray-100 rounded p-1 flex flex-col shadow-sm border border-gray-200"
    >
      <div className="mb-4 pl-2 px-1 py-1 bg-gray-200 rounded-md ">
        <h2 className="font-semibold">
          {column.name} ({itemCount})
        </h2>
        <div className="text-sm text-gray-600">R$ {formattedTotal}</div>
      </div>

      {/* Adiciona uma altura máxima e overflow-y-auto para rolagem nessa área */}
      <div className="flex flex-col gap-2  ">
        {extendedNegocios.map((negocio) => (
          <LazyLoadWrapper
            key={negocio.id}
            placeholder={<SpinIcon />}
          >
            <NegocioCard
              key={negocio.id}
              negocio={negocio}
              onOpenPopover={onOpenPopover}
            />
          </LazyLoadWrapper>
        ))}
      </div>
    </div>
  );
}
