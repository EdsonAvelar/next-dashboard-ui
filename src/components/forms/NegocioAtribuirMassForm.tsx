// components/forms/NegocioAtribuirMassForm.tsx
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useFormState } from "react-dom";
import { useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { assignMassNegocios } from "@/lib/actions";

type FormValues = {
  proprietarioId: string;
  etapaId: string;
  // Não é necessário registrar "negocioIds" pois será adicionado via payload
};

export default function NegocioAtribuirMassForm({
  selectedIds,
  onClose,
  relatedData,
}: {
  selectedIds: number[];
  onClose: () => void;
  relatedData: { users: any[]; etapas: any[] };
}) {
  const { register, handleSubmit } = useForm<FormValues>();
  const [state, formAction] = useFormState(assignMassNegocios, {
    success: false,
    msg: "",
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Constrói o payload adicionando o array de IDs como JSON
    const payload = new FormData();
    payload.append("proprietarioId", data.proprietarioId);
    payload.append("etapaId", data.etapaId);
    payload.append("negocioIds", JSON.stringify(selectedIds));

    startTransition(async () => {
      formAction(payload);
    });
  };

  useEffect(() => {
    if (state.success) {
      toast.success(state.msg);
      onClose();
      router.refresh();
    }
  }, [state, router, onClose]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <h1 className="text-xl font-semibold">Atribuir Negócios em Massa</h1>
      <label className="text-sm text-gray-700">
        Proprietário
        <select
          {...register("proprietarioId")}
          className="block w-full border rounded p-2 mt-1"
        >
          <option value="">SEM PROPRIETÁRIO</option>
          {relatedData.users.map((u: any) => (
            <option
              key={u.id}
              value={u.id}
            >
              {u.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-gray-700">
        Etapa do Funil
        <select
          {...register("etapaId")}
          className="block w-full border rounded p-2 mt-1"
        >
          <option value="">SEM ETAPA</option>
          {relatedData.etapas.map((e: any) => (
            <option
              key={e.id}
              value={e.id}
            >
              {e.nome}
            </option>
          ))}
        </select>
      </label>
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="submit"
          disabled={isPending}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Enviar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
