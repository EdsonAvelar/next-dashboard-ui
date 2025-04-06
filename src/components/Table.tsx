"use client";

import React, { useState } from "react";
import FormContainer from "./forms/FormContainer";
import NegocioAtribuirMassForm from "./forms/NegocioAtribuirMassForm";
import DeleteConfirmation from "./DeleteConfirmation";

type MassActionsProps = {
  selectedIds: number[];
  onClearSelection: () => void;
  massRelatedData: { users: any[]; etapas: any[] };
  allowedActions?: string[]; // novo prop para limitar ações
  model: "leadImportado" | "negocio";
};

function MassActions({
  selectedIds,
  onClearSelection,
  massRelatedData,
  allowedActions,
  model = "negocio",
}: MassActionsProps) {
  const [openAssign, setOpenAssign] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleTransferir = () => {
    console.log("Transferir → IDs selecionados:", selectedIds);
    console.log("relatedData: ", massRelatedData);
    setOpenAssign(true);
  };

  const handleAtribuir = () => {
    console.log("Atribuir → IDs selecionados:", selectedIds);
    console.log("relatedData: ", massRelatedData);
    setOpenAssign(true);
  };

  const handleDistribuir = () => {
    console.log("Distribuir → IDs selecionados:", selectedIds);
  };

  const handleDesativar = () => {
    console.log("Desativar → IDs selecionados:", selectedIds);
  };

  const handleDeletar = () => {
    setOpenDelete(true);
  };

  const handleRedistribuir = () => {
    console.log("Redistribuir → IDs selecionados:", selectedIds);
  };

  return (
    <>
      {/* Container absoluto para as ações */}
      <div className="absolute top-0 left-0 w-full z-10 bg-white shadow-sm p-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <span className="text-sm text-gray-600">
            {selectedIds.length} item(s) selecionado(s)
          </span>
          <div className="flex flex-wrap gap-2">
            {(!allowedActions || allowedActions.includes("atribuir")) && (
              <button
                onClick={handleAtribuir}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Atribuir
              </button>
            )}
            {(!allowedActions || allowedActions.includes("distribuir")) && (
              <button
                onClick={handleDistribuir}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Distribuir
              </button>
            )}
            {(!allowedActions || allowedActions.includes("desativar")) && (
              <button
                onClick={handleDesativar}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors text-sm"
              >
                Desativar
              </button>
            )}
            {(!allowedActions || allowedActions.includes("redistribuir")) && (
              <button
                onClick={handleRedistribuir}
                className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors text-sm"
              >
                Redistribuir
              </button>
            )}
            {(!allowedActions || allowedActions.includes("deletar")) && (
              <button
                onClick={handleDeletar}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
              >
                Deletar
              </button>
            )}
            <button
              onClick={onClearSelection}
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition-colors text-sm"
            >
              Limpar Seleção
            </button>
          </div>
        </div>
      </div>
      {openAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-45">
          <div className="bg-white p-4 rounded-md shadow-md w-[90%] sm:w-[400px]">
            <NegocioAtribuirMassForm
              selectedIds={selectedIds}
              relatedData={massRelatedData}
              onClose={() => {
                setOpenAssign(false);
                // Ao fechar o modal, também limpamos a seleção
                onClearSelection();
              }}
              onCancel={() => {
                setOpenAssign(false);
              }}
              model={model}
            />
          </div>
        </div>
      )}

      {openDelete && (
        <DeleteConfirmation
          message="Tem certeza que deseja deletar os leads importados?"
          selectedIds={selectedIds}
          model={model}
          onClose={() => {
            setOpenDelete(false);
            onClearSelection();
          }}
        />
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
  multipleActions?: boolean;
  massRelatedData?: { users: any[]; etapas: any[] };
  allowedActions?: string[]; // novo prop para limitar ações
  model: "leadImportado" | "negocio";
};

const Table = ({
  columns,
  rows,
  selectable = false,
  multipleActions = true,
  relatedData = { users: [], etapas: [] },
  massRelatedData,
  allowedActions,
  model,
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
    setSelectedRows(newSelected);
  };

  const clearSelection = () => {
    setSelectedRows(new Set());
  };

  return (
    <div className="relative">
      {/* Espaço reservado para as ações com altura fixa */}
      <div className="min-h-[60px]">
        {multipleActions && selectedRows.size > 0 && (
          <MassActions
            massRelatedData={massRelatedData || { users: [], etapas: [] }}
            selectedIds={Array.from(selectedRows)}
            onClearSelection={clearSelection}
            allowedActions={allowedActions}
            model={model}
          />
        )}
      </div>

      <table className="w-full mt-0">
        <thead className="bg-gray-50 p-2">
          <tr className="text-left text-gray-500 text-xs">
            {selectable && (
              <th
                key="checkbox"
                className="w-12 p-2"
              >
                <input
                  type="checkbox"
                  className="space-x-2 p-5"
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
