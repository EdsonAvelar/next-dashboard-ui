"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assignNegocio } from "@/lib/actions";

type FormValues = {
  proprietarioId: string;
  etapaId: string;
};

export default function NegocioAtribuirForm({
  data,
  setOpen,
  relatedData,
}: {
  data?: any;
  relatedData?: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { register, handleSubmit } = useForm<FormValues>();


  // useFormState gerencia o estado da ação do formulário (assignNegocio)
  const [state, formAction] = useFormState(assignNegocio, {
    success: false,
    msg: "",
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const formDataObject = new FormData();
    formDataObject.append("proprietarioId", formData.proprietarioId);
    formDataObject.append("etapaId", formData.etapaId);
    formAction(formDataObject);
  };

  useEffect(() => {
    if (state.success) {
       toast.success("Negócio atribuído com sucesso!");
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <h1 className="text-xl font-semibold">Atribuir Negócio</h1>

      <label className="text-sm text-gray-700">
        Proprietário
        <select
          {...register("proprietarioId")}
          className="block w-full border rounded p-2 mt-1"
        >
          <option value="">SEM PROPRIETÁRIO</option>
          <option value="1">Usuário 1</option>
          <option value="2">Usuário 2</option>
          <option value="3">Usuário 3</option>
        </select>
      </label>

      <label className="text-sm text-gray-700">
        Etapa do Funil
        <select
          {...register("etapaId")}
          className="block w-full border rounded p-2 mt-1"
        >
          <option value="">SEM ETAPA</option>
          <option value="1">Etapa 1</option>
          <option value="2">Etapa 2</option>
          <option value="3">Etapa 3</option>
        </select>
      </label>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Enviar
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
