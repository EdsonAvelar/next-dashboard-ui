"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormContainerProps } from "./forms/FormContainer";
import { deleteFuncionario, deleteProduction } from "@/lib/actions";
import { deleteEquipe } from "@/lib/actions";

// Import dinâmico dos forms já existentes
const FuncionarioForm = dynamic(() => import("./forms/FuncionarioForm"), {
  loading: () => <h1>Carregando...</h1>,
});
const NegocioForm = dynamic(() => import("./forms/NegocioForm"), {
  loading: () => <h1>Carregando...</h1>,
});

const NegocioMassForm = dynamic(() => import("./forms/NegocioMassForm"), {
  loading: () => <h1>Carregando...</h1>,
});

const EquipeForm = dynamic(() => import("./forms/EquipeForm"), {
  loading: () => <h1>Carregando...</h1>,
});
const NegocioAtribuirForm = dynamic(
  () => import("./forms/NegocioAtribuirForm"),
  {
    loading: () => <h1>Carregando...</h1>,
  }
);
const ProductionForm = dynamic(() => import("./forms/ProductionForm"), {
  loading: () => <h1>Carregando...</h1>,
});

const deleteActionMap = {
  user: deleteFuncionario,
  negocio: deleteFuncionario,
  producao: deleteProduction,
  equipe: deleteEquipe,
};

function getFormComponent(
  table: string,
  type: string,
  setOpen: Dispatch<SetStateAction<boolean>>,
  data?: any,
  relatedData?: any
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
    if (type === "assign") {
      return (
        <NegocioAtribuirForm
          data={data}
          setOpen={setOpen}
          relatedData={relatedData}
        />
      );
    }
    if (type === "createmassive") {
      return <NegocioMassForm setOpen={setOpen} />;
    } else {
      return (
        <NegocioForm
          type={type as "create" | "update"}
          relatedData={data}
          setOpen={setOpen}
        />
      );
    }
  }
  if (table === "producao") {
    return (
      <ProductionForm
        type={type as "create" | "update"}
        data={data}
        setOpen={setOpen}
      />
    );
  }
  if (table === "equipe") {
    return (
      <EquipeForm
        type={type as "create" | "update"}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    );
  }
  return null;
}

export default function FormModal({
  table,
  type,
  data,
  id,
  relatedData,
  button, // nova prop opcional para renderização do botão
  title, // nova prop opcional para o texto do botão
}: FormContainerProps & {
  type: "create" | "update" | "delete" | "assign" | "createmassive";
  relatedData?: any;
  button?: boolean;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const table2 = table ? table : "user";
  const [state, formAction] = useFormState(
    deleteActionMap[table2] as (
      state: { success: boolean; msg: string },
      payload: FormData
    ) => Promise<{ success: boolean; msg: string }>,
    { success: false, msg: "" }
  );

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
          <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
            Delete
          </button>
        </form>
      );
    } else if (
      type === "create" ||
      type === "update" ||
      type === "assign" ||
      type === "createmassive"
    ) {
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
      {button ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-green-700 hover:text-white border
           border-green-700 hover:bg-green-800 focus:ring-4
            focus:outline-none focus:ring-green-300 font-medium
             rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2
              dark:border-green-500 dark:text-green-500
               dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
        >
          {title || "Abrir Formulário"}
        </button>
      ) : (
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
      )}

      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-45 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[80%] lg:w-[70%] xl:w-[50%] 2xl:w-[50%]">
            {renderContent()}
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/close.png"
                alt="Fechar"
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
