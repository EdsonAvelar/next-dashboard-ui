"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
import SpinIcon from "./SpinIcon";

// Carrega o conteúdo das configurações de forma lazy (client-side only)
const LazyQuickSettingsContent = dynamic(
  () => import("./QuickSettingsContent"),
  {
    ssr: false,
    loading: () => <SpinIcon />,
  }
);

export default function QuickSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);

  return (
    <>
      {/* Botão flutuante (engrenagem) */}
      <button
        className="fixed top-1/2 right-0 z-50 p-3 bg-blue-600 text-white rounded-l-full shadow-lg hover:bg-blue-700 transition-colors"
        onClick={openPanel}
      >
        <Icon
          icon="mdi:cog"
          className="w-6 h-6"
        />
      </button>

      {/* Overlay (bloqueia o resto da tela) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closePanel} // Fecha ao clicar fora do painel
        />
      )}

      {/* Painel de Configurações (slide from right) */}
      <div
        className={`fixed top-0 right-0 h-full w-[30%] bg-white z-50 shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {isOpen && <LazyQuickSettingsContent closePanel={closePanel} />}
      </div>
    </>
  );
}
