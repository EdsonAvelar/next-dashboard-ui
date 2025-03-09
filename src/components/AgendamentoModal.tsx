"use client";

import { useState } from "react";

export default function AgendamentoModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: string, hora: string) => void;
}) {
  const [dataAgendado, setDataAgendado] = useState("");
  const [hora, setHora] = useState("");
  const [gerarProtocolo, setGerarProtocolo] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-[1050]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Novo Agendamento</h2>

        <label className="block mb-2">Agendado para:</label>
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={dataAgendado}
          onChange={(e) => setDataAgendado(e.target.value)}
        />

        <label className="block mt-4 mb-2">Hora:</label>
        <input
          type="time"
          className="w-full border p-2 rounded"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
        />

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={gerarProtocolo}
            onChange={() => setGerarProtocolo(!gerarProtocolo)}
          />
          <span>Gerar Protocolo</span>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => onConfirm(dataAgendado, hora)}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
