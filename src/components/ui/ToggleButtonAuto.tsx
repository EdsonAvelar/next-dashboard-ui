"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export interface ToggleButtonAutoProps {
  keyField: string; // Chave da configuração, por exemplo: "cardsColoridos"
  label?: string;
}

export default function ToggleButtonAuto({
  keyField,
  label = "",
}: ToggleButtonAutoProps) {
  const router = useRouter();
  // Estado do valor do toggle (inicia com false até que seja carregado)
  const [value, setValue] = useState(false);
  // Estado para o loading da atualização
  const [loading, setLoading] = useState(false);
  // Estado para o carregamento inicial da configuração
  const [initialLoading, setInitialLoading] = useState(true);

  // Quando o componente monta, busca o valor atual da configuração
  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch(`/api/getConfig?key=${keyField}`);
        if (response.ok) {
          const data = await response.json();
          // Supondo que o endpoint retorne um objeto com a propriedade "value"
          setValue(data.value === "true");
        } else {
          console.error("Erro ao buscar a configuração");
        }
      } catch (error) {
        console.error("Erro ao buscar a configuração", error);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchConfig();
  }, [keyField]);

  // Função que lida com a mudança do toggle e atualiza o banco
  async function handleChange(newValue: boolean) {
    setValue(newValue);
    setLoading(true);
    try {
      const response = await fetch("/api/updateConfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: keyField,
          value: newValue,
        }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        setValue(!newValue);
        console.error("Erro ao atualizar a configuração");
      }
    } catch (error) {
      console.error("Erro ao atualizar configuração", error);
      setValue(!newValue);
    }
    setLoading(false);
  }

  // Enquanto estiver carregando a configuração, pode exibir um placeholder
  if (initialLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => handleChange(e.target.checked)}
        className="sr-only peer focus:outline-none focus:ring-0"
        disabled={loading}
      />
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
}
