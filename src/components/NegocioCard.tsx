"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { HomeIcon } from "@heroicons/react/24/outline";

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

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded shadow p-2 cursor-move relative "
    >
      <div className="font-semibold text-gray-800 ">{negocio.titulo}</div>
      <div className="justify-between flex py-1">
        {/* //diminui o tamanho do icone */}
        <div className="flex items-center gap-2">
          <HomeIcon
            width={20}
            className="text-gray-500"
            strokeWidth={0.5}
          />
          <p className="text-sm text-gray-500">IMOVEL</p>
        </div>

        <div className="text-sm text-gray-500">R$ {negocio.valor}</div>
      </div>

      {negocio.cliente && (
        <div className="text-xs text-gray-400">Cliente: {negocio.cliente}</div>
      )}

      {/* Botão para abrir menu */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenu((prev) => !prev);
        }}
        className="absolute top-1 right-2 text-gray-400 hover:text-gray-600"
      >
        •••
      </button>

      {openMenu && (
        <div className="absolute top-8 right-2 bg-white border rounded shadow-lg w-36 z-10 text-sm">
          <ul className="flex flex-col">
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                console.log("Editar negócio", negocio.id);
                setOpenMenu(false);
              }}
            >
              Editar
            </li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                console.log("WhatsApp", negocio.id);
                setOpenMenu(false);
              }}
            >
              WhatsApp
            </li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                console.log("Gerar Proposta", negocio.id);
                setOpenMenu(false);
              }}
            >
              Gerar Proposta
            </li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                console.log("Multi Proposta", negocio.id);
                setOpenMenu(false);
              }}
            >
              Multi Proposta
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
