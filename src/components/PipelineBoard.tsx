"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  criarAgendamento,
  criarReuniao,
  salvarAprovacao,
  saveStageChange,
} from "@/lib/actions"; // Sua server action
import { useEffect, useState } from "react";
import Column from "./Column";
import AgendamentoModal from "./AgendamentoModal";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { AprovacaoStatus } from "@/lib/utils";
import GlobalPopover from "./pipeline/GlobalPopover";
import { NegocioItem } from "@/lib/types";

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

  // Estado para o popover global
  const [popoverData, setPopoverData] = useState<{
    negocio: NegocioItem | null;
    anchor: HTMLElement | null;
  }>({ negocio: null, anchor: null });

  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";

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
    const etapaAprovacoes = 5; // ID da coluna de "Aprovação"
    const etapaFechamento = 7;

    // Obtém o id da coluna original onde o negócio está
    const originalColumnId = columns.find((col) =>
      col.negocios.some((n) => n.id === negocioId)
    )?.id;

    if (originalColumnId === newEtapaId) return;

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
        const newEtapaId = 4;
        setColumns((prev) => updateColumns(prev, negocioId, newEtapaId));
        await saveStageChange(negocioId, newEtapaId);
      } else {
        toast.error(reuniao.msg);
      }
    } else if (newEtapaId === etapaAprovacoes) {
      const result = await salvarAprovacao({
        negocioId,
        status: AprovacaoStatus.ANALISE,
      });
      if (result.success) {
        toast.success(result.msg);
        const newEtapaId = 5;
        setColumns((prev) => updateColumns(prev, negocioId, newEtapaId));
        await saveStageChange(negocioId, newEtapaId);
      } else {
        toast.error(result.msg);
      }
    } else if (newEtapaId === etapaFechamento) {
      const res = await saveStageChange(negocioId, newEtapaId);
      if (res.success) {
        router.push("/negocios/fechamento?negocio_id=" + negocioId);
      } else {
        toast.error("Erro no Fechamento: " + res.msg);
      }
    } else {
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
      const newEtapaId = 3;
      setColumns((prev) => updateColumns(prev, selectedNegocio, newEtapaId));
      await saveStageChange(selectedNegocio, newEtapaId);
    } else {
      toast.error(agendamento.msg);
    }
    setShowModal(false);
    setSelectedNegocio(null);
  }

  // Filtra os negócios de cada coluna mantendo todas as propriedades
  const filteredColumns = columns.map((col) => {
    const filteredNegocios = col.negocios
      .filter((negocio) => {
        const titulo = negocio.titulo.toLowerCase();
        const cliente = negocio.cliente ? negocio.cliente.toLowerCase() : "";
        return titulo.includes(search) || cliente.includes(search);
      })
      // Ordena pelos negócios.updatedAt (mais recentes primeiro)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    return { ...col, negocios: filteredNegocios };
  });

  // Callback para abrir o popover global
  const handleOpenPopover = (negocio: NegocioItem, anchor: HTMLElement) => {
    setPopoverData({ negocio, anchor });
  };

  // Callback para fechar o popover
  const handleClosePopover = () => {
    setPopoverData({ negocio: null, anchor: null });
  };

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
          {filteredColumns.map((col) => (
            <Column
              key={col.id}
              column={col}
              onOpenPopover={handleOpenPopover}
            />
          ))}
        </div>
      </DndContext>
      <GlobalPopover
        negocio={popoverData.negocio}
        anchor={popoverData.anchor}
        onClose={handleClosePopover}
      />
    </>
  );
}
