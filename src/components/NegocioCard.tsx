"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { HomeIcon } from "@heroicons/react/24/outline";
import Badge from "./Badge";
import { useRouter } from "next/navigation";
import { formatCurrency, NegocioTipo, NegocioTipoOptions } from "@/lib/utils";
import { useMemo } from "react";
import { Icon } from "@iconify/react";
import { BadgeType, NegocioItem } from "@/lib/types";

interface NegocioCardProps {
  negocio: NegocioItem;
  onOpenPopover: (negocio: NegocioItem, anchor: HTMLElement) => void;
}

export default function NegocioCard({
  negocio,
  onOpenPopover,
}: NegocioCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: negocio.id.toString(),
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: transform ? 1000 : "auto",
  };

  const router = useRouter();
  const valorFormatado = formatCurrency(negocio.valor);
  const { daysDifference } = negocio;

  const badge = useMemo(() => {
    if (daysDifference === 0) {
      return { color: "green" as BadgeType, label: "HOJE" };
    } else if (daysDifference <= 2) {
      return { color: "indigo" as BadgeType, label: "NOVO" };
    } else if (daysDifference <= 3) {
      return { color: "yellow" as BadgeType, label: "RECENTE" };
    } else if (daysDifference <= 6) {
      return { color: "purple" as BadgeType, label: "ATENÇÃO" };
    } else if (daysDifference <= 10) {
      return { color: "red" as BadgeType, label: "URGENTE" };
    } else {
      return { color: "gray" as BadgeType, label: `${daysDifference} dias` };
    }
  }, [daysDifference]);

  const icon = () => {
    if (negocio.tipo === NegocioTipo.CARRO) {
      return (
        <Icon
          icon="mdi:car-outline"
          width="24"
          height="24"
        />
      );
    }
    return (
      <Icon
        icon="mdi:home-outline"
        width="24"
        height="24"
      />
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded shadow-md p-2 relative select-none"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-move"
      >
        <div className="flex gap-2 items-center">
          {icon()}

          <Badge type={badge.color}>{badge.label}</Badge>
        </div>
        <div className="font-semibold text-gray-800">{negocio.titulo}</div>
        <div className="flex justify-between py-1">
          <div className="flex items-center gap-2">
            {negocio.cliente && (
              <div className="text-xs text-gray-400">
                Cliente: {negocio.cliente}
              </div>
            )}
          </div>
          <div className="text-sm text-green-400 font-semibold">
            {valorFormatado}
          </div>
        </div>
      </div>
      {/* Botão para abrir o popover global */}
      <button
        className="absolute top-1 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          onOpenPopover(negocio, e.currentTarget);
        }}
      >
        •••
      </button>
    </div>
  );
}
