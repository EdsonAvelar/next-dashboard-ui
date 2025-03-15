"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import InputField from "../InputField";
import SelectInput from "../SelectInput";
// import { NegocioTipoOptions } from "@/lib/utils";
import { createNegocio } from "@/lib/actions";
import { NegocioSchema, negocioSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

export const NegocioTipoOptions = [
  { value: "CARRO", label: "Carro" },
  { value: "MOTO", label: "Moto" },
  { value: "CAMINHAO", label: "Caminhão" },
  { value: "TERRENO", label: "Terreno" },
  { value: "MAQUINARIO", label: "Maquinário" },
  { value: "SERVICO", label: "Serviço" },
];

const NegocioForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  setOpen: Dispatch<SetStateAction<boolean>>;
  data?: any;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NegocioSchema>({
    resolver: zodResolver(negocioSchema),
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

  const [state, formAction] = useFormState(createNegocio, {
    success: false,
    msg: "",
  });

  const onSubmit = handleSubmit(async (formData) => {
    formAction(formData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success("Negocio criado com sucesso");
      setOpen(false);
      router.refresh();
    }
  }, [state]);

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl font-semibold">Criar Negócio</h1>
      <span className="text-xs text-gray-400 font-medium">
        Informações do Contato e do Negócio
      </span>

      <div className="flex gap-4">
        <div className="flex flex-col gap-4 w-1/2">
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
            defaultValue={data?.nome_contato}
            register={register}
            error={errors?.nome_contato}
          />
          <InputField
            label="Telefone"
            name="telefone"
            isRequired={true}
            defaultValue={data?.telefone}
            register={register}
            error={errors?.telefone}
          />

          <SelectInput
            label="Tipo de Crédito"
            name="tipo_credito"
        
            register={register}
            defaultValue="CARRO"
            error={errors?.tipo_credito}
            options={[
              { value: "IMOVEL", label: "Imóvel" },
              ...tipoCreditoOptions,
            ]}
          />

          <InputField
            label="Valor do Crédito (opcional)"
            name="valor_credito"
            defaultValue={data?.valor_credito}
            register={register}
            error={errors?.valor_credito}
          />
        </div>
        <div className="flex flex-col gap-4 w-1/2">
          <InputField
            label="Título (opcional)"
            name="titulo"
            defaultValue={data?.titulo}
            register={register}
            error={errors?.titulo}
          />

          <InputField
            label="Whatsapp (opcional)"
            name="whatsapp"
            defaultValue={data?.whatsapp}
            register={register}
            error={errors?.whatsapp}
          />
          <InputField
            label="Email (opcional)"
            name="email"
            type="email"
            defaultValue={data?.email}
            register={register}
          />
        </div>
      </div>

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
