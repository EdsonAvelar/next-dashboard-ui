"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import InputField from "../InputField";
import SelectInput from "../SelectInput";

import {
  funcionarioSchema,
  FuncionarioSchema,
} from "@/lib/formValidationSchema";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createUser, updateUser } from "@/lib/actions";

const FuncionarioForm = ({
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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FuncionarioSchema>({
    resolver: zodResolver(funcionarioSchema),
  });

  // Recuperando os CARGOS a partir de uma API
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
  }, []);

  const [state, formAction] = useFormState(
    type === "create" ? createUser : updateUser,
    {
      success: false,
      msg: "",
    }
  );

  const onSubmit = handleSubmit((formData) => {
    // formAction({ ...data, img: img?.secure_url });
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.msg);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const [croppedImg, setCroppedImg] = useState<string | null>(null);

  // Callback para quando a imagem for cortada
  const handleCroppedImage = (croppedImage: string) => {
    setCroppedImg(croppedImage);
    // Atualiza o valor do campo "img" no formulário
    // setValue("img", croppedImage);
  };

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Criar " : "Atualizar"} Funcionário
      </h1>

      <div className="flex gap-4">
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
            defaultValue={data?.name} //{data?.name}
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
            // defaultValue="12345678"
            // defaultValue={data?.password}
            register={register}
            error={errors?.password}
          />
          <SelectInput
            label="Cargo"
            name="cargo"
            register={register}
            defaultValue={data?.cargo?.id}
            error={errors?.cargo}
            options={[
              { value: "", label: "Selecionar Cargo" },
              ...cargoOptions,
            ]}
          />
        </div>
        <div className="flex flex-col gap-4 w-1/2">
          <span className="text-xs text-gray-400 font-medium">
            Informações Opcionais
          </span>
          <div className="flex justify-between gap-4 flex-wrap">

            <InputField
              label="Contratacao"
              name="data_contratacao"
              defaultValue={
                type === "create"
                  ? new Date().toISOString().split("T")[0]
                  : data?.data_contratacao
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
              label="Endereco"
              name="endereco"
              defaultValue={data?.endereco}
              register={register}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500"
      >
        {type === "create" ? "create" : "update"}
      </button>
    </form>
  );
};

export default FuncionarioForm;
