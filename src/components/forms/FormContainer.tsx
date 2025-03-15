import { prisma } from "@/lib/prisma";
import FormModal from "../FormModal";

export type FormContainerProps = {
  table: "user" | "negocio" | "producao" | "equipe";
  type: "create" | "update" | "delete" | "assign";
  data?: any;
  id?: number;
};
const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
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
      case "equipe":
        console.log("Equipe");
        // Busca os usuários que têm permissão de gerenciar equipes.
        // Aqui, assumimos que essa permissão está registrada em um relacionamento com a entidade Role.
        // Por exemplo, filtramos usuários cujo role contenha "gerenciar_equipes".
        const leaders = await prisma.user.findMany({
          where: {
            roles: { some: { name: "gerenciar_equipe" } },
            equipeId: null,
            liderEquipe: null,
          },
          select: { id: true, name: true },
        });
        relatedData = { leaders };
        break;
      default:
        break;
    }
  }

  console.log(relatedData);

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
