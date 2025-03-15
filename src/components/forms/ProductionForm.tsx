"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import InputField from "../InputField";
import { productionSchema, ProductionSchema } from "@/lib/formValidationSchema";
import { createProduction, updateProduction } from "@/lib/actions";

export default function ProductionForm({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  // Configura o RHF + Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductionSchema>({
    resolver: zodResolver(productionSchema),
    defaultValues: {
      name: data?.name || "",
      startDate: data?.startDate || "",
      endDate: data?.endDate || "",
      isActive: data?.isActive ?? true,
    },
  });

  // Escolhe a action conforme o tipo (create ou update)
  const actionFn = type === "create" ? createProduction : updateProduction;
  const [state, formAction] = useFormState(actionFn, {
    success: false,
    msg: "",
  });

  const router = useRouter();

  // Fecha o modal e atualiza a página ao concluir
  useEffect(() => {
    if (state.success) {
      toast.success(
        `Produção ${type === "create" ? "criada" : "atualizada"} com sucesso!`
      );
      setOpen(false);
      router.refresh();
    } else if (state.msg && state.msg.trim().length > 0) {
      toast.error("Error: " + state.msg);
    }
  }, [state, setOpen, router, type]);

  // Submit do formulário
  const onSubmit = handleSubmit(async (formData) => {
    if (type === "update" && data?.id) {
      formData.id = data.id; // Necessário para o update
    }
    formAction(formData);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 p-4"
    >
      <h2 className="text-xl font-semibold">
        {type === "create" ? "Adicionar Produção" : "Editar Produção"}
      </h2>

      <InputField
        label="id"
        name="id"
        type="text"
        hidden={true}
        register={register}
      />

      {/* Nome */}
      <InputField
        label="Nome"
        name="name"
        type="text"
        register={register}
        error={errors.name}
      />

      {/* Datas */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Data de Início"
          name="startDate"
          type="date"
          register={register}
          error={errors.startDate}
        />
        <InputField
          label="Data de Término"
          name="endDate"
          type="date"
          register={register}
          error={errors.endDate}
        />
      </div>

      {/* Checkbox de ativo */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Ativa?</label>
        <input
          type="checkbox"
          {...register("isActive")}
          defaultChecked={data?.isActive ?? true}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {type === "create" ? "Salvar" : "Atualizar"}
      </button>
    </form>
  );
}
