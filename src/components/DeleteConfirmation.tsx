"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { deleteItemsAction, deleteUploadFile } from "@/lib/actions";

type DeleteFormValues = {
  ids: string;
};

interface DeleteConfirmationProps {
  message?: string;
  selectedIds: number[];
  model: "negocio" | "leadImportado" | "upload";
  onClose: () => void;
}

export default function DeleteConfirmation({
  message,
  selectedIds,
  model,
  onClose,
}: DeleteConfirmationProps) {
  const { register, handleSubmit } = useForm<DeleteFormValues>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = async (data: DeleteFormValues) => {
    const formData = new FormData();
    formData.append("ids", data.ids);

    startTransition(async () => {
      try {
        let res;

        res = await deleteItemsAction(formData, model);

        if (res.success) {
          toast.success("Itens excluídos com sucesso!");
          router.refresh();
        } else {
          toast.error(res.msg || "Erro ao excluir itens.");
        }
      } catch (error: any) {
        toast.error(`Erro ao excluir itens: ${error.message}`);
      } finally {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-2">Confirmação de Exclusão</h2>
        <p className="mb-4">
          {message ||
            `Você confirma a exclusão de ${selectedIds.length} item(s)?`}
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Input hidden com os IDs selecionados */}
          <input
            type="hidden"
            {...register("ids")}
            value={JSON.stringify(selectedIds)}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              disabled={isPending}
            >
              Confirmar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
