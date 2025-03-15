"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { HomeIcon } from "@heroicons/react/24/outline";
import Badge from "./Badge";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useRouter } from "next/navigation";

type NegocioItem = {
  id: number;
  titulo: string;
  valor: number;
  cliente?: string;
};

export default function NegocioCard({ negocio }: { negocio: NegocioItem }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: negocio.id.toString(),
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: transform ? 1000 : "auto",
  };

  const router = useRouter();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded shadow-md p-2 relative"
    >
      {/* Área de arraste */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-move"
      >
        <div className="flex gap-2">
          <HomeIcon
            width={20}
            className="text-gray-500"
            strokeWidth={0.5}
          />
          <Badge type={"blue"}>NOVO</Badge>
        </div>
        <div className="font-semibold text-gray-800">{negocio.titulo}</div>
        <div className="justify-between flex py-1">
          <div className="flex items-center gap-2">
            {negocio.cliente && (
              <div className="text-xs text-gray-400">
                Cliente: {negocio.cliente}
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">R$ {negocio.valor}</div>
        </div>
      </div>

      {/* Botão e menu de contexto gerenciados pelo Popover */}
      <Popover className="absolute top-1 right-2">
        <PopoverButton className="text-gray-400 hover:text-gray-600 focus:outline-none">
          •••
        </PopoverButton>
        <PopoverPanel className="absolute top-8 right-0 bg-white border rounded shadow-lg w-36 z-10 text-sm">
          <ul className="flex flex-col">
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                router.push(`/negocios/editar?negocio_id=${negocio.id}`)
              }
            >
              Editar
            </li>
            {/* <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => console.log("WhatsApp", negocio.id)}
            >
              WhatsApp
            </li> */}
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                router.push(`/propostas/gerador?negocio_id=${negocio.id}`)
              }
            >
              Gerar Proposta
            </li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => console.log("Multi Proposta", negocio.id)}
            >
              Multi Proposta
            </li>
          </ul>
        </PopoverPanel>
      </Popover>
    </div>
  );
}
