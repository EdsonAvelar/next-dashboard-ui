"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { criarAgendamento, criarReuniao, saveStageChange } from "@/lib/actions"; // Sua server action
import { useEffect, useState } from "react";
import Column from "./Column";
import { CSS } from "@dnd-kit/utilities";
import AgendamentoModal from "./AgendamentoModal";
import { toast } from "react-toastify";

type NegocioItem = {
  id: number;
  titulo: string;
  valor: number;
  cliente?: string;
};

type ColumnData = {
  id: number;
  name: string;
  negocios: NegocioItem[];
};

export default function PipelineBoard({
  columns: initialColumns,
  proprietarioId,
}: {
  columns: ColumnData[];
  proprietarioId: number;
}) {
  const [columns, setColumns] = useState<ColumnData[]>(initialColumns);
  const [selectedNegocio, setSelectedNegocio] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  function updateColumns(
    prev: ColumnData[],
    negocioId: number,
    newEtapaId: number
  ): ColumnData[] {
    const draggedItem = prev
      .flatMap((col) => col.negocios)
      .find((n) => n.id === negocioId);
    if (!draggedItem) return prev;
    const newCols = prev.map((col) => ({
      ...col,
      negocios: col.negocios.filter((n) => n.id !== negocioId),
    }));
    return newCols.map((col) => {
      if (col.id === newEtapaId) {
        return { ...col, negocios: [...col.negocios, draggedItem] };
      }
      return col;
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const negocioId = +active.id;
    const newEtapaId = +over.id;
    const etapaReuniaoAgendada = 3; // ID da coluna de "Reunião Agendada"
    const etapaReuniao = 4; // ID da coluna de "Reunião"

    // Obtém o id da coluna original onde o negócio está
    const originalColumnId = columns.find((col) =>
      col.negocios.some((n) => n.id === negocioId)
    )?.id;

    // Se o cartão for "solto" na mesma coluna, não faça nada
    if (originalColumnId === newEtapaId) return;

    // Se a nova etapa for "Reunião Agendada", abre o modal e não atualiza o estado imediatamente
    if (newEtapaId === etapaReuniaoAgendada) {
      setSelectedNegocio(negocioId);
      setShowModal(true);
      return;
    } else if (newEtapaId === etapaReuniao) {
      const reuniao = await criarReuniao(
        { success: false, msg: "" },
        negocioId
      );

      if (reuniao.success) {
        toast.success(reuniao.msg);
        // Atualiza o estado para mover o card para a coluna de "Reunião"
        const newEtapaId = 4;
        setColumns((prev) => updateColumns(prev, negocioId, newEtapaId));

        // Salva na base de dados a mudança de etapa
        const res = await saveStageChange(negocioId, newEtapaId);
      } else {
        toast.error(reuniao.msg);
        // Se a reunião falhar ou for cancelada, o estado permanece inalterado
      }
    } else {
      // Chama a Server Action para atualizar o negócio
      const res = await saveStageChange(negocioId, newEtapaId);
      if (res.success) {
        setColumns((prev) => updateColumns(prev, negocioId, newEtapaId));
      } else {
        toast.error("Falha ao mover negócio. Operação cancelada.");
      }
    }
  }

  async function handleConfirmAgendamento(dataAgendado: string, hora: string) {
    if (!selectedNegocio) return;

    const agendamento = await criarAgendamento({
      dataAgendado,
      hora,
      negocioId: selectedNegocio,
    });

    if (agendamento.success) {
      toast.success(agendamento.msg);
      // Atualiza o estado para mover o card para a coluna de "Reunião Agendada"
      const newEtapaId = 3;
      setColumns((prev) => updateColumns(prev, selectedNegocio, newEtapaId));

      // Salva no banco de dados
      const res = await saveStageChange(selectedNegocio, newEtapaId);
    } else {
      toast.error(agendamento.msg);
      // Se o agendamento falhar ou for cancelado, o estado permanece inalterado
    }
    setShowModal(false);
    setSelectedNegocio(null);
  }

  return (
    <>
      <AgendamentoModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedNegocio(null);
        }}
        onConfirm={handleConfirmAgendamento}
      />

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 min-w-max">
          {columns.map((col) => (
            <Column
              key={col.id}
              column={col}
            />
          ))}
        </div>
      </DndContext>
    </>
  );
}
