import { prisma } from "@/lib/prisma";
import FormModal from "../FormModal";

export type FormContainerProps = {
  table: "teacher" | "student" | "parent" | "user" | "negocio";
  type: "create" | "update" | "delete" | "assign";
  data?: any;
  id?: number;

};
const FormContainer = async ({
  table,
  type,
  data,
  id,

}: FormContainerProps) => {
  let relatedData = {};

  // Carrega dados relacionados conforme a ação
  if (table === "negocio" && type === "assign") {
    // Precisamos da lista de usuários e de etapas de funil
    const [users, etapas] = await Promise.all([
      prisma.user.findMany({ select: { id: true, name: true } }),
      prisma.etapaFunil.findMany({ select: { id: true, nome: true } }),
    ]);
    relatedData = {
      users,
      etapas,
    };
  } else if (type !== "delete") {
    switch (table) {
      case "user":
        const cargos = await prisma.cargo.findMany();
        relatedData = { cargos: cargos };
        break;
      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
