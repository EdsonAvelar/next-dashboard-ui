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
import { createFuncionario, updateFuncionario } from "@/lib/actions";

const FuncionarioForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  setOpen: Dispatch<SetStateAction<boolean>>;
  data?: any;
  relatedData?:any;
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
    async function fetchCargo() {
      try {
        const res = await fetch("/api/cargos");
        const cargos = await res.json();
        // Mapeie os dados para o formato { value, label }
        const options = cargos.map((role: { name: string; id: string }) => ({
          value: role.id,
          label: role.name,
        }));
        setCargoOptions(options);
      } catch (error) {
        console.error("Erro ao buscar cargos:", error);
      }
    }
    fetchCargo();
  }, []);

  // const onSubmit = handleSubmit(
  //   async (formData) => {
  //     console.log("Commit!");
  //     try {
  //       // Envia os dados para a API (lembre-se: birthday deve ser enviado em formato adequado, ex: ISO string)
  //       const res = await fetch("/api/funcionario/create", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           ...formData,
  //           //birthday: formData.data_contratacao.toISOString(), // converte a data para string ISO
  //         }),
  //       });
  //       if (!res.ok) {
  //         console.log(res);

  //         const errorData = await res.json();
  //         console.error("Erro ao salvar funcionário:", errorData.error);
  //       } else {
  //         const savedData = await res.json();
  //         console.log("Funcionário salvo com sucesso:", savedData);

  //         // window.location.reload();

  //         setOpen(false);
  //         router.refresh();

  //         toast("Funcionario Criado com Sucesso");

  //         // Aqui você pode, por exemplo, redirecionar ou mostrar uma mensagem de sucesso
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   },
  //   (formErrors) => {
  //     console.log(formErrors);
  //   }
  // );

  const [state, formAction] = useFormState(
    type === "create" ? createFuncionario : updateFuncionario,
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
      toast(state.msg);
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
      <h1 className="text-xl font-semibold">Criar Funcionário</h1>

      <div className="flex gap-4">
        <div className="flex flex-col gap-4 w-1/2">
          <span className="text-xs text-gray-400 font-medium">
            Informações Obrigatórias
          </span>
          <input
            hidden
            {...register("id")}
            value={data?.id}
          />
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
            defaultValue={data?.cargo?.name}
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
            {/* Utilizando o SelectInput para o campo "Sex" */}

            <InputField
              label="Contratacao"
              name="data_contratacao"
              defaultValue={new Date().toISOString().split("T")[0]}
              register={register}
              type="date"
            />

            <InputField
              label="Telefone"
              name="telefone"
              defaultValue={data?.phone}
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
              defaultValue={data?.address}
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
