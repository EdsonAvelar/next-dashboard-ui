"use server";

import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { UserStatus } from "@/lib/utils";
import { getTimeComercialVendedores } from "@/lib/actions";
export default async function AprovacoesChart({
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate: Date;
}) {
  // 1. Obtém todos os vendedores com a permissão "time_comercial"
  const vendedores = await getTimeComercialVendedores();

  // 2. Busca todas as aprovações dentro do intervalo, incluindo o negócio para pegar o user_id
  const aprovas = await prisma.aprovacao.findMany({
    where: {
      data_aprovacao: {
        gte: fromDate,
        lte: toDate,
      },
    },
    include: {
      negocio: {
        select: {
          user_id: true,
        },
      },
    },
  });

  // 3. Agrupa as aprovações por user_id (obtido do negócio)
  const groupedMap: Record<number, number> = {};
  aprovas.forEach((aprovacao) => {
    const userId = aprovacao.negocio.user_id;
    if (userId !== null) {
      groupedMap[userId] = (groupedMap[userId] || 0) + 1;
    }
  });

  // 4. Para cada vendedor, monta o array de dados, atribuindo 0 se não houver aprovações
  const data = vendedores.map((vendedor) => ({
    userId: vendedor.id,
    name: vendedor.name,
    value: groupedMap[vendedor.id] || 0,
  }));

  // 5. Calcula o total de aprovações
  const totalAprovacoes = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="p-4">
      <BarChartComponent
        title={`Aprovações`}
        subtitle={`${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`}
        bottomTitle={`Total de ${totalAprovacoes} Propostas`}
        bottomSubtitle={`Mostra o total de propostas feitas por vendedor`}
        data={data}
        xKey="name"
        valueKey="value"
        icon="/icons/approval.png" // Ajuste para o caminho do ícone desejado
      />
    </div>
  );
}
