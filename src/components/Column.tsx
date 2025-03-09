"use client";

import { useDroppable } from "@dnd-kit/core";
import NegocioCard from "@/components/NegocioCard";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type NegocioItem = {
  id: number;
  titulo: string;
  valor: number;
  cliente?: string;
};

type ColumnProps = {
  column: {
    id: number;
    name: string;
    negocios: NegocioItem[];
  };
};

export default function Column({ column }: ColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id.toString(), // o "over" no PipelineBoard será over.id === column.id
  });

  const style = {
    backgroundColor: isOver ? "#f0f4f8" : "",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-72 min-w-[18rem] bg-gray-100 rounded p-2 flex flex-col"
    >
      <h2 className="text-lg font-semibold mb-2">{column.name}</h2>
      <div className="flex flex-col gap-2">
        {column.negocios.map((negocio) => (
          <NegocioCard
            key={negocio.id}
            negocio={negocio}
          />
        ))}
      </div>
    </div>
  );
}
