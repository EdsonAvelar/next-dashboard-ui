import { prisma } from "@/lib/prisma";
import PipelineBoard from "../PipelineBoard";
import { NegocioItem } from "@/lib/types";

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
      <div className="mt-4  ">
        <PipelineBoard
          columns={initialColumns}
          proprietarioId={proprietarioId}
        />
      </div>
    </>
  );
};

export default PipelineBoardContainer;
