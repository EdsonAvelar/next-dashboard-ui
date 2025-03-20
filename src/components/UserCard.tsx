import Image from "next/image";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { prisma } from "@/lib/prisma";
import { formatCurrency, parseDateBr } from "@/lib/utils";
import { getProducaoDates } from "@/lib/actions";

interface SearchParams {
  data_inicio: string;
  data_fim: string;
}

interface UserCardProps {
  type: string;
  fromDate?: Date;
  toDate?: Date;
}

const UserCard = async ({
  type,

  fromDate,
  toDate,
}: UserCardProps) => {
  const etapaAprovacao = 5;
  let data;

  if (type === "Negócios Ativos") {
    data = await prisma.negocio.count({
      where: { status: "ATIVO" },
    });
  } else if (type === "Em Aprovação") {
    const result = await prisma.negocio.aggregate({
      _sum: { valor: true },
      where: { etapa_funil_id: etapaAprovacao },
    });
    const sumValor = result._sum.valor || 0;
    data = formatCurrency(Number(sumValor));
  } else if (type === "Vendas em Conclusão") {
    // Se não receber fromDate/toDate via props, tenta computar a partir de searchParams

    const result = await prisma.fechamento.aggregate({
      _sum: { preco_bem: true },
      where: {
        status: "RASCUNHO",
        data_fechamento: {
          gte: fromDate,
          lte: toDate,
        },
      },
    });
    const sumValue = result._sum.preco_bem || 0;
    data = formatCurrency(Number(sumValue));
  } else if (type === "Total Vendido") {
    // Se não receber fromDate/toDate via props, tenta computar a partir de searchParams

    const result = await prisma.fechamento.aggregate({
      _sum: { preco_bem: true },
      where: {
        status: "FECHADA",
        data_fechamento: {
          gte: fromDate,
          lte: toDate,
        },
      },
    });
    const sumValue = result._sum.preco_bem || 0;
    data = formatCurrency(Number(sumValue));
  } else {
    // Exemplo para outros tipos
    data = await prisma.admin.count();
  }

  return (
    <div className="relative rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          1%
        </span>
        <Image
          src="/more.png"
          alt="More"
          width={20}
          height={20}
        />
      </div>
      <h1 className="text-2xl font-semibold my-4">{data?.toString()}</h1>
      <h4 className="capitalize text-sm font-medium text-gray-500">{type}</h4>
      <CurrencyDollarIcon className="absolute right-2  -translate-y-[70%] text-white h-10 w-10" />
    </div>
  );
};

export default UserCard;
