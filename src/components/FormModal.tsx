// FormModal.tsx
"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { deleteFuncionario } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormContainerProps } from "./forms/FormContainer";

// Import dinâmico dos forms já existentes
const FuncionarioForm = dynamic(() => import("./forms/FuncionarioForm"), {
  loading: () => <h1>Carregando...</h1>,
});
const NegocioForm = dynamic(() => import("./forms/NegocioForm"), {
  loading: () => <h1>Carregando...</h1>,
});

// Import dinâmico do novo form de atribuição
const NegocioAtribuirForm = dynamic(
  () => import("./forms/NegocioAtribuirForm"),
  {
    loading: () => <h1>Carregando...</h1>,
  }
);

const deleteActionMap = {
  user: deleteFuncionario,
  negocio: deleteFuncionario,
  parent: deleteFuncionario,
  student: deleteFuncionario,
  teacher: deleteFuncionario,
};

// Função para mapear table+type -> componente
function getFormComponent(
  table: string,
  type: string,
  setOpen: Dispatch<SetStateAction<boolean>>,
  data?: any,
  relatedData?: any,

) {
  if (table === "user") {
    return (
      <FuncionarioForm
        type={type as "create" | "update"}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    );
  }

  if (table === "negocio") {
    // Se for 'assign', usamos NegocioAtribuirForm
    if (type === "assign") {
      return (
        <NegocioAtribuirForm
          data={data}
          setOpen={setOpen}
          relatedData={relatedData}
        />
      );
    } else {
      // create/update
      return (
        <NegocioForm
          type={type as "create" | "update"}
          data={data}
          setOpen={setOpen}
          relatedData={relatedData}
        />
      );
    }
  }
  return null;
}

export default function FormModal({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Se for delete, use a actionMap
  const [state, formAction] = useFormState(deleteActionMap[table], {
    success: false,
    msg: "",
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Negócio deletado com sucesso");
      setOpen(false);
      router.refresh();
    }
  }, [state]);

  function renderContent() {
    if (type === "delete" && id) {
      return (
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
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center ">
            Delete
          </button>
        </form>
      );
    }
    if (type === "create" || type === "update" || type === "assign") {
      const FormCmp = getFormComponent(table, type, setOpen, data, relatedData);
      if (!FormCmp) return <div>Form not found</div>;
      return FormCmp;
    }
    return "Form not found";
  }

  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
        ? "bg-lamaSky"
        : type === "delete"
          ? "bg-lamaPurple"
          : "bg-lamaSky"; // fallback para 'assign'

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
            {renderContent()}
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
}
