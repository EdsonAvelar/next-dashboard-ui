// app/settings/SettingsContainer.tsx
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import ConfiguracaoCliente from "../ConfiguracaoCliente";

// Exemplos de dados que podem ser buscados no BD
async function getProductions() {
  // Supondo que você tenha uma tabela "producao"
  const productions = await prisma.producao.findMany({
    orderBy: { name: "asc" },
  });
  return productions;
}

async function getActiveProduction() {
  // Busca a produção ativa
  const activeProduction = await prisma.producao.findFirst({
    where: { isActive: true },
  });
  return activeProduction;
}

/**
 * Componente Container (Server Component):
 * Faz as consultas ao banco e passa para o Client Component
 */
export default async function ConfiguracaoContainer() {
  // Buscando dados no servidor
  const productions = await getProductions();
  const activeProduction = await getActiveProduction();

  // Exemplo de data (apenas para ilustrar)
  const today = dayjs().format("YYYY-MM-DD");

  // Aqui você pode buscar outras informações, como configs do sistema etc.

  // Monta o objeto de dados que será repassado ao componente client
  const relatedData = {
    productions,
    activeProduction,
    today,
  };

  return <ConfiguracaoCliente relatedData={relatedData} />;
}
