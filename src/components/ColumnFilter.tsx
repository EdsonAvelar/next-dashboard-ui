"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";

type FilterType = "text" | "select" | "dateRange";

interface ColumnFilterProps {
  paramKey: string; // Nome do parâmetro (ex: 'teacherId')
  filterType: FilterType; // 'text', 'select' ou 'dateRange'
  label?: string; // Rótulo para o popover (opcional)
  options?: string[]; // Se for 'select', podemos ter opções
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({
  paramKey,
  filterType,
  label,
  options,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Valor atual do filtro na URL
  const currentValue = searchParams.get(paramKey) || "";

  // Estados locais para manipular o filtro antes de aplicar
  const [inputValue, setInputValue] = useState(currentValue);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Quando o valor no URL mudar, atualizamos o estado local
  useEffect(() => {
    setInputValue(currentValue);
    // Se for dateRange, extrair as datas do formato "YYYY-MM-DD_to_YYYY-MM-DD"
    if (filterType === "dateRange") {
      const [start, end] = currentValue.split("_to_");
      setStartDate(start || "");
      setEndDate(end || "");
    }
  }, [currentValue, filterType]);

  // Determina se o ícone deve ficar verde
  const isActive = !!currentValue;

  // Aplica o filtro atualizando a query string
  const applyFilter = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    // Reinicia a paginação
    params.set("page", "1");

    if (filterType === "text" || filterType === "select") {
      if (inputValue) {
        params.set(paramKey, inputValue);
      } else {
        params.delete(paramKey);
      }
    } else if (filterType === "dateRange") {
      if (startDate || endDate) {
        params.set(paramKey, `${startDate || ""}_to_${endDate || ""}`);
      } else {
        params.delete(paramKey);
      }
    }

    // Atualiza a URL (força o Server Component a recarregar com o novo filtro)
    router.push(`?${params.toString()}`);
  };

  // Limpa o filtro
  const clearFilter = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete(paramKey);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <Popover className="relative">
      {/* Botão de Filtro */}
      <PopoverButton
        className={`w-6 h-6 rounded-full ${
          isActive ? "bg-green-400" : "bg-gray-200"
        } flex items-center justify-center`}
      >
        {/* Ícone */}
        <FunnelIcon className="w-4 h-4 text-white" />
      </PopoverButton>

      {/* Painel do Popover (menu de contexto) */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <PopoverPanel className="absolute z-10 mt-2 w-64 origin-top-right rounded-md bg-white p-4 shadow-lg">
          <h3 className="font-semibold mb-2">{label || "Filtrar"}</h3>

          {/* Campos de acordo com o filterType */}
          {filterType === "text" && (
            <input
              type="text"
              className="border p-2 w-full"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          )}

          {filterType === "select" && (
            <select
              className="border p-2 w-full"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            >
              <option value="">Selecione...</option>
              {options?.map((opt) => (
                <option
                  key={opt}
                  value={opt}
                >
                  {opt}
                </option>
              ))}
            </select>
          )}

          {filterType === "dateRange" && (
            <div className="flex flex-col gap-2">
              <label>
                Início:
                <input
                  type="date"
                  className="border p-2 w-full"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <label>
                Fim:
                <input
                  type="date"
                  className="border p-2 w-full"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <PopoverButton
              as="button"
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={clearFilter}
            >
              Limpar
            </PopoverButton>
            <PopoverButton
              as="button"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={applyFilter}
            >
              Aplicar
            </PopoverButton>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};

export default ColumnFilter;
