// components/ProductionSelector.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

// Defina o tipo mínimo para a produção (ajuste conforme necessário)
export interface Production {
  id: number;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
}

interface ProductionSelectorProps {
  productions: Production[];
  dest: string;
}

export default function ProductionSelector({
  productions,
  dest,
}: ProductionSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState("");

  // Ao montar, verifica se existe production_name na URL e, se sim, seleciona a opção correspondente
  useEffect(() => {
    const prodName = searchParams.get("production_name");
    if (prodName) {
      const selectedProd = productions.find(
        (prod) => prod.name.toLowerCase() === prodName.toLowerCase()
      );
      if (selectedProd) {
        setSelectedId(selectedProd.id.toString());
      }
    }
  }, [searchParams, productions]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedId(id);
    const selectedProd = productions.find((prod) => prod.id.toString() === id);
    if (selectedProd) {
      // Converte as datas para o formato "YYYY-MM-DD"
      const startDate = new Date(selectedProd.startDate)
        .toISOString()
        .split("T")[0];
      const endDate = new Date(selectedProd.endDate)
        .toISOString()
        .split("T")[0];
      // Atualiza a URL com os parâmetros de data e production_name
      router.push(
        `${dest}?data_inicio=${startDate}&data_fim=${endDate}&production_name=${encodeURIComponent(
          selectedProd.name
        )}`
      );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <label className="block text-sm font-medium text-gray-700">
        Selecione a Produção:
      </label>
      <select
        value={selectedId}
        onChange={handleChange}
        className="w-full sm:w-auto border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Selecione</option>
        {productions.map((prod) => (
          <option
            key={prod.id}
            value={prod.id}
          >
            {prod.name}
          </option>
        ))}
      </select>
    </div>
  );
}
