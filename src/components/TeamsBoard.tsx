// components/TeamsBoard.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { Icon } from "@iconify/react";
import { moveUserToEquipe } from "@/lib/actions";
import { useFormState } from "react-dom";
import { undoEquipe } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string;
  avatar?: string | null;
}

interface Equipe {
  id: number;
  name: string;
  logo?: string | null;
  lider?: User | null;
  membros: User[];
}

export interface Column {
  id: string;
  name: string;
  logo?: string | null;
  leader?: User | null;
  items: { id: string; name: string; avatar?: string | null }[];
}

export default function TeamsBoard({
  equipes,
  usersNoTeam,
}: {
  equipes: Equipe[];
  usersNoTeam: User[];
}) {
  const [columns, setColumns] = useState<Column[]>([]);

  // Atualiza o estado local sempre que as props mudam
  useEffect(() => {
    const noTeamColumn: Column = {
      id: "no-team",
      name: "Sem Equipe",
      logo: null,
      leader: null,
      items: usersNoTeam.map((u) => ({
        id: u.id.toString(),
        name: u.name,
        avatar: u.avatar,
      })),
    };

    const equipeColumns: Column[] = equipes.map((eq) => ({
      id: eq.id.toString(),
      name: eq.name,
      logo: eq.logo,
      leader: eq.lider,
      items: eq.membros.map((m) => ({
        id: m.id.toString(),
        name: m.name,
        avatar: m.avatar,
      })),
    }));

    setColumns([noTeamColumn, ...equipeColumns]);
  }, [equipes, usersNoTeam]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !over.id) return;

    const sourceColumnId = active.data.current?.columnId;
    const destinationColumnId = over.id;
    if (!sourceColumnId || sourceColumnId === destinationColumnId) return;

    const userId = parseInt(active.id.toString(), 10);
    const newEquipeId =
      destinationColumnId === "no-team"
        ? null
        : parseInt(destinationColumnId.toString(), 10);

    const result = await moveUserToEquipe(userId, newEquipeId);
    if (!result.success) {
      console.error(result.msg);
      toast.error(result.msg);
      return;
    }

    setColumns((prev) => {
      const newColumns = structuredClone(prev) as Column[];
      const source = newColumns.find((col) => col.id === sourceColumnId);
      const destination = newColumns.find(
        (col) => col.id === destinationColumnId
      );
      if (!source || !destination) return prev;
      const itemIndex = source.items.findIndex((i) => i.id === active.id);
      if (itemIndex < 0) return prev;
      const [movedItem] = source.items.splice(itemIndex, 1);
      destination.items.push(movedItem);
      return newColumns;
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {columns.map((col) => (
          <ColumnComponent
            key={col.id}
            column={col}
          />
        ))}
      </div>
    </DndContext>
  );
}

function ColumnComponent({ column }: { column: Column }) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id });
  const isNoTeamColumn = column.id === "no-team";
  const background = isOver && !isNoTeamColumn ? "bg-blue-50" : "bg-white";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [undoState, undoAction] = useFormState(undoEquipe, {
    success: false,
    msg: "",
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (undoState.success) {
      router.refresh();
      setMenuOpen(false);
    }
  }, [undoState, router]);

  const handleEdit = () => {
    setMenuOpen(false);
  };

  const handleDelete = () => {
    undoAction({ id: parseInt(column.id, 10) });
    setMenuOpen(false);
    // Aqui você pode abrir um FormModal de deleção
  };

  return (
    <div
      ref={setNodeRef}
      className={`relative rounded-md p-4 min-h-[200px] shadow flex flex-col gap-4 ${background}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {column.logo && (
            <img
              src={column.logo}
              alt="logo"
              className="w-8 h-8 object-cover rounded-full bg"
            />
          )}
          <span className="text-sm text-gray-500 uppercase font-semibold">
            {column.name}
          </span>
        </div>
        {!isNoTeamColumn && (
          <div
            className="relative"
            ref={menuRef}
          >
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hover:text-gray-600"
            >
              <Icon
                icon="mdi:menu"
                className="w-5 h-5"
              />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                <button
                  onClick={handleEdit}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Icon
                    icon="mdi:pencil-outline"
                    className="mr-2"
                  />
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Icon
                    icon="mdi:delete-outline"
                    className="mr-2"
                  />
                  Desfazer Equipe
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {column.leader && (
        <div className="flex items-center gap-2">
          <img
            src={column.leader.avatar || "/noAvatar.png"}
            alt="Líder"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-sm text-gray-700 font-medium">
            Lider: {column.leader.name}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {column.items.map((item) => (
          <DraggableUser
            key={item.id}
            item={item}
            columnId={column.id}
          />
        ))}
      </div>
    </div>
  );
}

function DraggableUser({
  item,
  columnId,
}: {
  item: { id: string; name: string; avatar?: string | null };
  columnId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: { columnId },
    });
  const style = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 10,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 bg-gray-100 p-2 rounded-md shadow-sm cursor-pointer"
    >
      <img
        src={item.avatar || "/noAvatar.png"}
        alt="Membro"
        className="w-8 h-8 rounded-full object-cover"
      />
      <span className="text-sm text-gray-800">{item.name}</span>
    </div>
  );
}
