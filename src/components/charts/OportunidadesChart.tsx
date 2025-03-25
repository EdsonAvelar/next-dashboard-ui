"use server";
// app/dashboards/OportunidadesChart/page.jsx
import { prisma } from "@/lib/prisma";
import BarChartComponent from "./BarChartComponent";
import { parseDateBr, parseDateUsa } from "@/lib/utils";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function OportunidadesChart({
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate: Date;
}) {
  // 1. Obtém todos os vendedores com a permissão "time_comercial"
  const vendedores = await getTimeComercialVendedores();

  // 3. Faz o groupBy em 'negocio' (outra opção é um loop manual)
  // Exemplo: contar quantos negocios (status='ativo') por userId, no range de data_criacao
  const grouped = await prisma.negocio.groupBy({
    by: ["user_id"],
    _count: { _all: true },
    where: {
      status: "ATIVO",
      data_criacao: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  // 3. Cria um map para associar cada vendedor (userId) ao número de oportunidades
  const groupedMap: Record<number, number> = {};
  grouped.forEach((item) => {
    if (item.user_id !== null) {
      groupedMap[item.user_id] = item._count._all;
    }
  });

  // 4. Para cada vendedor, monta o array de dados, atribuindo 0 caso não exista oportunidade

  let data = vendedores.map((vendedor) => ({
    userId: vendedor.id,
    name: vendedor.name,
    value: groupedMap[vendedor.id] || 0,
  }));

  // 4. Para garantir cores consistentes, adiciona uma propriedade 'color' para cada vendedor

  // 5. Calcula o total de oportunidades
  const totalOportunidades = data.reduce((acc, item) => acc + item.value, 0);

  // 6. Renderiza o ChartCard
  return (
    <div className="p-4">
      <BarChartComponent
        title={`Oportunidades`}
        subtitle={`${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`}
        bottomTitle={`Total de ${totalOportunidades} Oportunidades`}
        bottomSubtitle={`Mostra o total de oportunidades criadas por vendedor`}
        data={data}
        xKey="name"
        valueKey="value"
        icon="/icons/briefcase.png"
      />
    </div>
  );
}
