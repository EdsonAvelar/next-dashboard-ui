"use client";

import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useRef } from "react";

interface GlobalPopoverProps {
  negocio: {
    id: number;
    titulo: string;
    telefone: string;
    whatsapp: string;
  } | null;
  anchor: HTMLElement | null;
  onClose: () => void;
}

export default function GlobalPopover({
  negocio,
  anchor,
  onClose,
}: GlobalPopoverProps) {
  const router = useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !(anchor && anchor.contains(event.target as Node))
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, anchor]);



  if (!negocio || !anchor) return null;

  const rect = anchor.getBoundingClientRect();
  // Defina a largura conhecida do popover (w-40 equivale a ~160px)
  const popoverWidth = 60;
  let left = rect.left + window.scrollX - 130;
  // Se o popover extrapolar a largura da tela, reposicione para a esquerda
  if (left + popoverWidth > window.innerWidth) {
    left = window.innerWidth - popoverWidth - 10; // margem de 10px
  }

  const style = {
    position: "absolute" as const,
    top: rect.bottom + window.scrollY,
    left,
    zIndex: 1000,
  };

  const hasZap = negocio.whatsapp ? true : false;

  return createPortal(
    <div
      ref={popoverRef}
      style={style}
      className="bg-white border rounded-md shadow-lg w-40 text-sm relative"
    >
      <button
        type="button"
        onClick={onClose}
        className="hover:bg-gray-200 rounded w-full h-8 bg-red-400 flex items-center justify-center mx-auto"
      >
        <XMarkIcon className="w-4 h-4 text-white" />
      </button>

      <ul className="flex flex-col pt-1">
        <li
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
          onClick={() => {
            onClose();
            router.push(`/negocios/editar?negocio_id=${negocio.id}`);
          }}
        >
          <Icon
            icon="mdi:pencil"
            width="16"
            height="16"
            className="mr-2"
          />
          Editar
        </li>
        {hasZap && (
          <li
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
            onClick={() => {
              onClose();
              window.open(`https://wa.me/55${negocio.whatsapp}`, "_blank");
            }}
          >
            <Icon
              icon="mdi:whatsapp"
              width="16"
              height="16"
              className="mr-2"
            />

            <div className="flex flex-col">
              <div className="">WhatsApp</div>
              <div className=""> {negocio.whatsapp}</div>
            </div>
          </li>
        )}
        <li
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
          onClick={() => {
            onClose();

            window.location.href = `tel:${negocio.telefone}`;
          }}
        >
          <Icon
            icon="mdi:phone"
            width="16"
            height="16"
            className="mr-2"
          />
          <div className="flex flex-col">
            <div className="">Telefone</div>
            <div className="">{negocio.telefone}</div>
          </div>
        </li>
        <li
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
          onClick={() => {
            onClose();
            router.push(`/propostas/gerador?negocio_id=${negocio.id}`);
          }}
        >
          <Icon
            icon="mdi:file-document-edit-outline"
            width="16"
            height="16"
            className="mr-2"
          />
          Gerar Proposta
        </li>

        <hr className="my-2" />

        <li
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-red-500"
          onClick={() => {
            onClose();
            router.push(`/propostas/gerador?negocio_id=${negocio.id}`);
          }}
        >
          <Icon
            icon="mdi:close-circle-outline"
            width="16"
            height="16"
            className="mr-2"
          />
          Perdeu
        </li>
        <li
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-green-500"
          onClick={() => {
            onClose();
            router.push(`/propostas/gerador?negocio_id=${negocio.id}`);
          }}
        >
          <Icon
            icon="mdi:check-circle-outline"
            width="16"
            height="16"
            className="mr-2"
          />
          Ganhou
        </li>
      </ul>
    </div>,
    document.body
  );
}
