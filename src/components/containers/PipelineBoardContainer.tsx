import { prisma } from "@/lib/prisma";
import PipelineBoard from "../PipelineBoard";
import FormContainer from "../forms/FormContainer";
import ProprietarioFilterSelect from "../ProprietarioFilterSelect";

type NegocioItem = {
  id: number;
  titulo: string;
  valor: number;
  cliente?: string;
};

type ColumnData = {
  id: number;
  name: string;
  negocios: NegocioItem[];
};

const PipelineBoardContainer = async ({
  columns: initialColumns,
  proprietarioId,
}: {
  columns: ColumnData[];
  proprietarioId: number;
}) => {
  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true },
  });

  return (
    <>
      <div className="fixed top-[60px] left-[180px]right-0 z-10  shadow flex gap-4">
        {/* Conteúdo do header */}
        <FormContainer
          table="negocio"
          type="create"
        />
        <ProprietarioFilterSelect users={allUsers} />
      </div>
      <div className="mt-10">
        <PipelineBoard
          columns={initialColumns}
          proprietarioId={proprietarioId}
        />
      </div>
    </>
  );
};

export default PipelineBoardContainer;
