"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import InputField from "../InputField";
import SelectInput from "../SelectInput";
// import { NegocioTipoOptions } from "@/lib/utils";
import { createNegocio, updateNegocio } from "@/lib/actions";
import { NegocioSchema, negocioSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { NegocioTipoOptions } from "@/lib/utils";

const NegocioForm = ({
  type,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  setOpen?: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NegocioSchema>({
    resolver: zodResolver(negocioSchema),
    defaultValues: {
      tipo: relatedData?.tipo || "",
      // ...outros campos
    },
  });

  const searchParams = useSearchParams();
  const proprietarioId = searchParams.get("proprietario_id") || "";

  // Estado para as opções do Select referente ao tipo de crédito.
  // Você pode buscar via API (ex: "/api/negocioTipo") ou definir estaticamente.
  const [tipoCreditoOptions, setTipoCreditoOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    async function fetchTipoCredito() {
      setTipoCreditoOptions([...NegocioTipoOptions]);
    }
    fetchTipoCredito();
  }, []);

  const [state, formAction] = useFormState(
    type === "create" ? createNegocio : updateNegocio,
    {
      success: false,
      msg: "",
    }
  );

  const onSubmit = handleSubmit(async (formData) => {
    formAction(formData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success("Negocio criado com sucesso");

      if (setOpen) setOpen(false);
      router.refresh();
    } else if (state.msg) {
      toast.error(state.msg);
    }
  }, [state]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl font-semibold">Criar Negócio</h1>
      <span className="text-xs text-gray-400 font-medium">
        Informações do Contato e do Negócio
      </span>

      {/* Linha 1: 3 inputs em uma mesma linha */}
      <div
        className={`grid grid-cols-1 gap-4 ${type === "create" ? "md:grid-cols-2" : "md:grid-cols-3"}`}
      >
        {type === "update" && (
          <InputField
            label="id"
            name="id"
            isRequired={true}
            hidden={true}
            defaultValue={relatedData.id}
            register={register}
          />
        )}

        {/* Mesmo que o InputField de Proprietário seja hidden, ele pode ser incluído sem impactar o layout */}
        {proprietarioId && (
          <InputField
            label="Proprietario ID"
            name="proprietario_id"
            isRequired={true}
            hidden={true}
            defaultValue={proprietarioId}
            register={register}
          />
        )}

        <InputField
          label="Nome do Contato"
          name="nome_contato"
          isRequired={true}
          defaultValue={relatedData?.nome_contato}
          register={register}
          error={errors?.nome_contato}
        />
        <InputField
          label="Telefone"
          name="telefone"
          isRequired={true}
          defaultValue={relatedData?.telefone}
          register={register}
          error={errors?.telefone}
        />
        <SelectInput
          label="Tipo de Crédito"
          name="tipo"
          control={control}
          defaultValue={relatedData?.tipo || ""}
          isRequired={true}
          error={errors?.tipo}
          options={[
            { value: "", label: "Selecione o Crédito" },
            ...tipoCreditoOptions,
          ]}
        />
        <InputField
          label="Valor do Crédito (opcional)"
          name="valor"
          type="number"
          defaultValue={relatedData?.valor}
          register={register}
          error={errors?.valor}
        />
      </div>

      {/* Linha 2: Campos adicionais para atualização */}
      {type === "update" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <InputField
            label="Título (opcional)"
            name="titulo"
            defaultValue={relatedData?.titulo}
            register={register}
            error={errors?.titulo}
          />
          <InputField
            label="Whatsapp (opcional)"
            name="whatsapp"
            defaultValue={relatedData?.whatsapp}
            register={register}
            error={errors?.whatsapp}
          />
          {/* O campo Email ocupará toda a linha em telas maiores */}
          <div className="md:col-span-1">
            <InputField
              label="Email (opcional)"
              name="email"
              type="email"
              defaultValue={relatedData?.email}
              register={register}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500"
      >
        {type === "create" ? "Criar" : "Atualizar"}
      </button>
    </form>
  );
};

export default NegocioForm;
