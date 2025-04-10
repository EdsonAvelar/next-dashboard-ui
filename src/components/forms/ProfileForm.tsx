// components/forms/ProfileForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import InputField from "../InputField";
import SelectInput from "../SelectInput";
import {
  funcionarioSchema,
  FuncionarioSchema,
} from "@/lib/formValidationSchema";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { updateUser } from "@/lib/actions";

type ProfileFormProps = {
  data: any;
  relatedData: any;
};

const ProfileForm = ({ data, relatedData }: ProfileFormProps) => {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FuncionarioSchema>({
    resolver: zodResolver(funcionarioSchema),
  });

  // Carrega as opções de cargos (a partir dos dados relacionados)
  const [cargoOptions, setCargoOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const { cargos } = relatedData;
    const options = cargos.map((cargo: { name: string; id: string }) => ({
      value: cargo.id,
      label: cargo.name,
    }));
    setCargoOptions(options);
  }, [relatedData]);

  // Usamos o hook useFormState para disparar a ação de update
  const [state, formAction] = useFormState(updateUser, {
    success: false,
    msg: "",
  });

  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.msg);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl font-semibold">Atualizar Perfil</h1>

      <div className="flex gap-4">
        {/* Coluna da esquerda: Informações obrigatórias */}
        <div className="flex flex-col gap-4 w-1/2">
          <span className="text-xs text-gray-400 font-medium">
            Informações Obrigatórias
          </span>
          {data && (
            <InputField
              label="Id"
              name="id"
              defaultValue={data?.id}
              register={register}
              hidden={true}
            />
          )}
          <InputField
            label="Nome"
            name="name"
            isRequired={true}
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />

          <InputField
            label="Email"
            name="email"
            isRequired={true}
            type="email"
            defaultValue={data?.email}
            register={register}
            error={errors?.email}
          />

          <InputField
            label="Password"
            isRequired={true}
            name="password"
            type="password"
            register={register}
            error={errors?.password}
          />

          <SelectInput
            label="Cargo"
            name="cargo"
            control={control}
            defaultValue={data?.cargo?.id}
            error={errors?.cargo}
            options={[
              { value: "", label: "Selecionar Cargo" },
              ...cargoOptions,
            ]}
          />
        </div>

        {/* Coluna da direita: Informações opcionais */}
        <div className="flex flex-col gap-4 w-1/2">
          <span className="text-xs text-gray-400 font-medium">
            Informações Opcionais
          </span>
          <div className="flex justify-between gap-4 flex-wrap">
            <InputField
              label="Data Contratação"
              name="data_contratacao"
              defaultValue={
                data?.data_contratacao || new Date().toISOString().split("T")[0]
              }
              register={register}
              type="date"
            />

            <InputField
              label="Telefone"
              name="telefone"
              defaultValue={data?.telefone}
              register={register}
            />

            <InputField
              label="CPF"
              name="cpf"
              defaultValue={data?.cpf}
              register={register}
            />

            <InputField
              label="Endereço"
              name="endereco"
              defaultValue={data?.endereco}
              register={register}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500"
        >
          Atualizar
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
