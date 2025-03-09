// app/components/AgendamentoActions.tsx
"use client";

import { useState } from "react";
import AgendamentoModal from "./AgendamentoModal";
import { criarAgendamento } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function AgendamentoActions({
  negocioId,
}: {
  negocioId: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleConfirm = async (dataAgendado: string, hora: string) => {
    // Aqui você pode chamar sua Server Action para criar o novo agendamento,
    const agendamento = await criarAgendamento({
      dataAgendado: dataAgendado,
      hora: hora,
      negocioId: negocioId,
    });

    if (!agendamento.success) {
      console.log(agendamento.msg);
    } else {
      console.log("agendamento sucesso: " + agendamento.msg);
    }
    // Por exemplo, se estiver usando router.refresh():
    router.refresh();

    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="btn btn-warning"
        onClick={() => setIsOpen(true)}
      >
        REAGENDAR
      </button>
      {isOpen && (
        <AgendamentoModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
