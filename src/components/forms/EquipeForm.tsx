"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import InputField from "../InputField";
import LogoUpload from "../LogoUpload";
import { equipeSchema, EquipeSchema } from "@/lib/formValidationSchema";
import { createEquipe, updateEquipe } from "@/lib/actions";
import { useFormState } from "react-dom";

interface LeaderOption {
  id: number;
  name: string;
}

export default function EquipeForm({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: { leaders?: LeaderOption[] };
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EquipeSchema>({
    resolver: zodResolver(equipeSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      liderId: data?.liderId ? data.liderId.toString() : "",
      // O campo 'logo' será populado via LogoUpload
      logo: data?.logo || "",
    },
  });

  const actionFn = type === "create" ? createEquipe : updateEquipe;
  const [state, formAction] = useFormState(actionFn, {
    success: false,
    msg: "",
  });

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Equipe ${type === "create" ? "criada" : "atualizada"} com sucesso!`
      );
      setOpen(false);
      router.refresh();
    } else if (state.msg && state.msg.trim().length > 0) {
      toast.error("Error: " + state.msg);
    }
  }, [state, setOpen, router, type]);

  const onSubmit = handleSubmit((formData) => {
    if (type === "update" && data?.id) {
      formData.id = data.id;
    }
    formAction(formData);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 p-4"
    >
      <h2 className="text-xl font-semibold">
        {type === "create" ? "Criar Equipe" : "Atualizar Equipe"}
      </h2>

      {/* Nome da Equipe */}
      <InputField
        label="Nome"
        name="name"
        type="text"
        register={register}
        error={errors.name}
      />

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          {...register("description")}
          className="w-full border p-2 rounded-md"
        />
        {errors.description && (
          <span className="text-red-500 text-xs">
            {errors.description.message}
          </span>
        )}
      </div>

      {/* Líder da Equipe */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Líder (Gerenciar Equipe)
        </label>
        <select
          {...register("liderId")}
          className="w-full border p-2 rounded-md"
        >
          <option value="">Selecione um líder</option>
          {relatedData?.leaders?.map((leader) => (
            <option
              key={leader.id}
              value={leader.id}
            >
              {leader.name}
            </option>
          ))}
        </select>
        {errors.liderId && (
          <span className="text-red-500 text-xs">{errors.liderId.message}</span>
        )}
      </div>

      {/* Componente de Upload de Logo com Preview Oval */}
      <LogoUpload
        value={data?.logo || ""}
        onChange={(logoValue) => setValue("logo", logoValue)}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {type === "create" ? "Salvar" : "Atualizar"}
      </button>
    </form>
  );
}
