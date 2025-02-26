"use client";

import React, { useState } from "react";

type TableProps = {
  columns: {
    header: string | JSX.Element;
    accessor: string;
    className?: string;
  }[];
  rows: React.ReactElement[];
  selectable?: boolean;
};

const Table = ({ columns, rows, selectable = false }: TableProps) => {
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

  return (
    <table className="w-full mt-4">
      <thead>
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
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          if (selectable) {
            const id = row.props["data-rowid"];

            const checked = selectedRows.has(id);
            return React.cloneElement(row, { key: row.key }, [
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
            ]);
          }
          return row;
        })}
      </tbody>
    </table>
  );
};

export default Table;
