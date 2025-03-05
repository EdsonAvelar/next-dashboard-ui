"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { deleteFuncionario } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormContainerProps } from "./forms/FormContainer";

const deleteActionMap = {
  user: deleteFuncionario,
  negocio: deleteFuncionario,
  parent: deleteFuncionario,
  student: deleteFuncionario,
  teacher: deleteFuncionario,
};

const FuncionarioForm = dynamic(() => import("./forms/FuncionarioForm"), {
  loading: () => <h1>Carregando...</h1>,
});

const NegocioForm = dynamic(() => import("./forms/NegocioForm"), {
  loading: () => <h1>Carregando...</h1>,
});

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  user: (setOpen, type, data, relatedData) => (
    <FuncionarioForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  negocio: (setOpen, type, data, relatedData) => (
    <NegocioForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
        ? "bg-lamaSky"
        : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      msg: "",
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast("Negocio deletado com sucesso");
        setOpen(false);
        router.refresh();
      }
    }, [state]);

    return type === "delete" && id ? (
      <form
        action={formAction}
        className="p-4 flex flex-col gap-4"
      >
        <input
          type="hidden"
          name="id"
          value={id}
          hidden
        />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delte this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center ">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      "Form not found"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image
          src={`/${type}.png`}
          alt=""
          width={16}
          height={16}
        />
      </button>

      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-45 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/close.png"
                alt=""
                width={14}
                height={14}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
