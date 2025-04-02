"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Table from "./Table";
import Pagination from "./Pagination";
import { ITEM_PER_PAGE } from "@/lib/settings";

type PaginatedTableProps = {
  columns: any[];
  rows: React.ReactNode[]; // Todos os rows disponíveis
  page: number;
  count: number;
  itemsPerPage?: number; // opcional
  massRelatedData?: any; // novo prop para usuarios e etapas
  allowedActions?: string[];
  model: string;
};

export default function PaginatedTable({
  columns,
  rows,
  page,
  count,
  itemsPerPage, // opcional
  massRelatedData, // novo
  allowedActions,
  model,
}: PaginatedTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pega o valor do param "items" da URL, se existir, ou usa o itemsPerPage ou o default ITEM_PER_PAGE
  const itemsParam = searchParams.get("items");
  const effectiveItemsPerPage =
    itemsPerPage || (itemsParam ? parseInt(itemsParam, 10) : ITEM_PER_PAGE);

  // Função para modificar o tamanho da página e reiniciar a página para 1
  const changePageSize = (newSize: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("items", newSize.toString());
    params.set("page", "1");
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Pega a página atual da URL ou usa a prop 'page'
  const currentPage =
    parseInt(searchParams.get("page") as string, 10) || page || 1;

  // Calcula a fatia dos rows que serão exibidos
  const startIndex = (currentPage - 1) * effectiveItemsPerPage;
  const visibleRows = rows
    .slice(startIndex, startIndex + effectiveItemsPerPage)
    .filter((row) => React.isValidElement(row));

  return (
    <div>
      {/* Linha superior com select de tamanho de itens */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <label
            htmlFor="pageSize"
            className="mr-2 text-sm"
          >
            Itens por página:
          </label>
          <select
            id="pageSize"
            defaultValue={effectiveItemsPerPage}
            onChange={(e) => changePageSize(Number(e.target.value))}
            className="border rounded p-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={1000}>1000</option>
          </select>
        </div>
        <div>{/* Outras ações, se necessário */}</div>
      </div>

      {/* Componente da tabela recebe as linhas visíveis e os dados complementares */}
      <Table
        columns={columns}
        rows={visibleRows}
        selectable={true}
        massRelatedData={massRelatedData}
        allowedActions={allowedActions}
        model={model}
      />

      {/* Componente de paginação */}
      <Pagination
        page={currentPage}
        count={count}
        itemsPerPage={effectiveItemsPerPage}
      />
    </div>
  );
}
