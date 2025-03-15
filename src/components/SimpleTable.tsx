// components/SimpleTable.tsx
"use client";

import React, { useState, useMemo } from "react";

export interface Column {
  header: string;
  className?: string;
}

export interface SimpleTableProps {
  columns: Column[];
  rows: React.ReactNode[]; // array completo de linhas
}

const SimpleTable: React.FC<SimpleTableProps> = ({ columns, rows }) => {
  // Estado para controle de paginação
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalEntries = rows.length;
  const totalPages = Math.ceil(totalEntries / pageSize);

  // Calcula as linhas da página atual
  const currentRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return rows.slice(startIndex, endIndex);
  }, [rows, currentPage, pageSize]);

  // Manipulador para alterar o número de itens por página
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reseta para a primeira página
  };

  // Manipuladores para os botões de navegação
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Calcula os índices para exibição do texto "Showing X to Y of Z entries"
  const startEntry = totalEntries > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endEntry = Math.min(currentPage * pageSize, totalEntries);

  return (
    <div>
      {/* Cabeçalho da tabela com controle de itens por página e botões de navegação */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Show{" "}
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="mx-2 border border-gray-300 rounded p-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>{" "}
          entries
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages || totalEntries === 0}
            className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-4 py-3 border-b ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, idx) => (
                <React.Fragment key={idx}>{row}</React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  className="px-4 py-2"
                  colSpan={columns.length}
                >
                  No entries available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Rodapé da tabela */}
      <div className="mt-4 text-sm text-gray-600">
        {totalEntries > 0
          ? `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`
          : "No entries available."}
      </div>
    </div>
  );
};

export default SimpleTable;
