"use client";

import React from "react";
import ToggleButtonAuto from "./ToggleButtonAuto";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";

interface QuickSettingsContentProps {
  closePanel: () => void;
}

export default function QuickSettingsContent({
  closePanel,
}: QuickSettingsContentProps) {
  const router = useRouter();

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Cabeçalho do painel */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-left gap-2">
          <h2 className="text-xl font-semibold">Configurações</h2>
          <p className="font-sm text-gray-500">
            Clique nas configurações rápidas
          </p>
        </div>

        <div className="flex gap-2">
            <button
            onClick={() => router.refresh()}
            className="text-gray-500 hover:text-gray-800"
            >
            <Icon icon="mdi:refresh" width="24" height="24" />
            </button>
          <button
            onClick={closePanel}
            className="text-gray-500 hover:text-gray-800"
          >
            <Icon icon="mdi:close" width="24" height="24" />
          </button>
        </div>
      </div>

      <hr></hr>

      {/* Configuração de exemplo */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-gray-700">Exibir Vendedores Zerados</span>
        <ToggleButtonAuto keyField="exibirVendedoresZerados" />
      </div>

      {/* Adicione aqui outras configurações rápidas, se desejar */}
    </div>
  );
}
