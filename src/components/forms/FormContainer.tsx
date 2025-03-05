import { prisma } from "@/lib/prisma";
import FormModal from "../FormModal";

export type FormContainerProps = {
  table: "teacher" | "student" | "parent" | "user" | "negocio";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
};
const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  if (type !== "delete") {
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
