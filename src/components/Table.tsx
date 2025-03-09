"use client";

import React, { useState } from "react";
import FormContainer from "./forms/FormContainer";
import NegocioAtribuirMassForm from "./forms/NegocioAtribuirMassForm";

// Exemplo de componente para ações em massa
function MassActions({
  selectedIds,
  onClearSelection,
  massRelatedData,
}: {
  selectedIds: number[];
  onClearSelection: () => void;
  massRelatedData: { users: any[]; etapas: any[] };
}) {
  const [openAssign, setOpenAssign] = useState(false);

  const handleAtribuir = () => {
    console.log("Atribuir → IDs selecionados:", selectedIds);

    console.log("relatedData: ", massRelatedData);
    // Aqui você pode chamar um fetch para API ou abrir um modal
    setOpenAssign(true);
  };

  const handleDistribuir = () => {
    console.log("Distribuir → IDs selecionados:", selectedIds);
  };

  const handleDesativar = () => {
    console.log("Desativar → IDs selecionados:", selectedIds);
  };

  const handleDeletar = () => {
    console.log("Deletar → IDs selecionados:", selectedIds);
  };

  const handleRedistribuir = () => {
    console.log("Redistribuir → IDs selecionados:", selectedIds);
  };
  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-3 mb-2  rounded shadow-sm gap-2">
        <span className="text-sm text-gray-600">
          {selectedIds.length} item(s) selecionado(s)
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAtribuir}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm"
          >
            Atribuir
          </button>
          <button
            onClick={handleDistribuir}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm"
          >
            Distribuir
          </button>
          <button
            onClick={handleDesativar}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors text-sm"
          >
            Desativar
          </button>
          <button
            onClick={handleRedistribuir}
            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors text-sm"
          >
            Redistribuir
          </button>
          <button
            onClick={handleDeletar}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
          >
            Deletar
          </button>
          <button
            onClick={onClearSelection}
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition-colors text-sm"
          >
            Limpar Seleção
          </button>
        </div>
      </div>
      {openAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-45">
          <div className="bg-white p-4 rounded-md shadow-md w-[90%] sm:w-[400px]">
            <NegocioAtribuirMassForm
              selectedIds={selectedIds}
              relatedData={massRelatedData}
              onClose={() => setOpenAssign(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

type TableProps = {
  columns: {
    header: string | JSX.Element;
    accessor: string;
    className?: string;
  }[];
  relatedData?: any;
  rows: React.ReactElement[];
  selectable?: boolean;
  multipleActions?: boolean; // <-- nova prop
  massRelatedData?: { users: any[]; etapas: any[] };
};

const Table = ({
  columns,
  rows,
  selectable = false,
  multipleActions = true,
  relatedData = { users: [], etapas: [] },
  massRelatedData,
}: TableProps) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const isAllSelected = rows.length > 0 && selectedRows.size === rows.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = rows.map((row) => row.props["data-rowid"]);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleRowSelect = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }

    console.log(newSelected);

    setSelectedRows(newSelected);
  };

  const clearSelection = () => {
    setSelectedRows(new Set());
  };

  return (
    <div>
      {multipleActions && selectedRows.size > 0 && (
        <>
          <MassActions
            massRelatedData={massRelatedData || { users: [], etapas: [] }}
            selectedIds={Array.from(selectedRows)}
            onClearSelection={clearSelection}
          />
        </>
      )}
      <table className="w-full mt-4">
        <thead className="bg-gray-50 p-2">
          <tr className="text-left text-gray-500 text-xs">
            {selectable && (
              <th
                key="checkbox"
                className="w-10"
              >
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={col.className}
              >
                <div className="p-3 uppercase">{col.header}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            if (selectable) {
              const id = row.props["data-rowid"];

              const checked = selectedRows.has(id);
              return React.cloneElement(
                row,
                { key: row.props["data-rowid"] ?? row.key },
                [
                  <td
                    key="checkbox"
                    className="p-2"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => handleRowSelect(id, e.target.checked)}
                    />
                  </td>,
                  ...React.Children.toArray(row.props.children),
                ]
              );
            }
            return row;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
