// app/settings/ConfiguracoesCRM.tsx
"use client";

import React, { useState } from "react";
import ToggleButtonAuto from "../ui/ToggleButtonAuto";

export default function ConfiguracoesCRM({}: {}) {
  // Esses valores podem vir de uma consulta ao banco; neste exemplo, usamos valores fixos.

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Configurações CRM
      </h2>
      <p className="text-sm text-gray-700 mb-4">Data atual (exemplo):</p>
      <div className="space-y-8">
        {/* Grupo Gráficos */}
        <div className="p-4 border rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Grupo Gráficos
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Cards Coloridos</span>
            <ToggleButtonAuto keyField="cardsColoridos" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-gray-700">Exibir Vendedores Zerados</span>
            <ToggleButtonAuto keyField="exibirVendedoresZerados" />
          </div>
        </div>

        {/* Grupo de Notificação */}
        <div className="p-4 border rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Grupo de Notificação
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Notificação de Nova Venda</span>
            <ToggleButtonAuto keyField="notificacaoNovaVenda" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-gray-700">Som de Applause</span>
            <ToggleButtonAuto keyField="somApplause" />
          </div>
        </div>

        {/* Grupo Negócios */}
        <div className="p-4 border rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Grupo Negócios
          </h3>
          <p className="text-gray-600">
            Personalização de protocolo de agendamento (a implementação será
            realizada futuramente).
          </p>
        </div>

        {/* <div className="p-4 border rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Configuração de Gamificação
          </h3>
          <div className="mb-4">
            <label className="block text-gray-700">Meta de Venda (R$)</label>
            <input
              type="number"
              value={metaVenda}
              onChange={(e) => setMetaVenda(Number(e.target.value))}
              className="mt-1 border px-3 py-2 rounded w-full outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-gray-700">
              Meta de Agendamento (R$)
            </label>
            <input
              type="number"
              value={metaAgendamento}
              onChange={(e) => setMetaAgendamento(Number(e.target.value))}
              className="mt-1 border px-3 py-2 rounded w-full outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div> */}

        {/* Outras Configurações Importantes */}
        {/* <div className="p-4 border rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Outras Configurações Importantes
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">
                Integração com APIs Externas
              </span>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">
                Envio de E-mails/Notificações
              </span>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">
                Segurança - Autenticação de Dois Fatores
              </span>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700">Fuso Horário</label>
              <select className="mt-1 border px-3 py-2 rounded w-full outline-none focus:ring-2 focus:ring-blue-200">
                <option value="GMT-3">GMT-3</option>
                <option value="GMT-0">GMT-0</option>
                <option value="GMT+1">GMT+1</option>
              </select>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
