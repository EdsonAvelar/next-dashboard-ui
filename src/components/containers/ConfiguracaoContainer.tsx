import React from "react";
import ConfiguracaoCliente from "../ConfiguracaoCliente";
import { prisma } from "@/lib/prisma"; // exemplo de importação do Prisma
import dayjs from "dayjs";
import { getConfigurations } from "@/lib/actions";


// Exemplo de função para buscar as configurações do CRM no banco
async function createImageList() {
  const fields = [
    "logo_circular",
    "logo_horizontal_pequeno",
    "logo_horizontal_grande",
    "marca_dagua",
    "ranking_logo",
    "card_meta_1",
    "card_meta_2",
    "banner_sidebar",
    "simulacao_folha_proposta",
    "simulacao_imovel",
    "simulacao_caminhao",
    "simulacao_maquinario",
    "simulacao_veiculo",
  ];

  const configs = await getConfigurations(fields);

  // Mapeia para o formato esperado (se não existir valor, defaultImage fica vazio)
  const crmImages = [
    {
      title: "Logo Circular",
      aspect: 1,
      defaultImage: configs.logo_circular,
      field: "logo_circular",
      filename: "logo_circular",
      description:
        "Logo circular exibida na barra de navegação lateral quando colapsada",
    },
    {
      title: "Logo Horizontal Pequeno (512px vs 256px)",
      aspect: 2,
      defaultImage: configs.logo_horizontal_pequeno,
      field: "logo_horizontal_pequeno",
      filename: "logo_horizontal_pequeno",
      description: "Logo horizontal ",
    },
    {
      title: "Logo Horizontal Grande (1280px vs 128px)",
      aspect: 5,
      defaultImage: configs.logo_horizontal_grande,
      field: "logo_horizontal_grande",
      filename: "logo_horizontal_grande",
      description: "Logo horizontal grande ",
    },
    {
      title: "Marca D'Agua (1280px vs 1280px)",
      aspect: 1,
      defaultImage: configs.marca_dagua,
      field: "marca_dagua",
      filename: "marca_dagua",
      description: "Marca D'Agua",
    },
    {
      title: "Ranking (1280px vs 720px)",
      aspect: 2,
      defaultImage: configs.ranking_logo,
      field: "ranking_logo",
      filename: "ranking_logo",
      description: "Ranking Logo",
    },
    {
      title: "Logo Meta 1 (350px vs 90px)",
      aspect: 2,
      defaultImage: configs.card_meta_1,
      field: "card_meta_1",
      filename: "card_meta_1",
      description: "Imagem do Card ao bater meta 1",
    },
    {
      title: "Logo Meta 2 (350px vs 90px)",
      aspect: 2,
      defaultImage: configs.card_meta_2,
      field: "card_meta_2",
      filename: "card_meta_2",
      description: "Imagem do Card ao bater meta 2",
    },
    {
      title: "Banner Sidebar (360 px vs 512px)",
      aspect: 360 / 512,
      defaultImage: configs.banner_sidebar,
      field: "banner_sidebar",
      filename: "banner_sidebar",
      description: "Imagem do Card ao bater meta 2",
    },
  ];

  //  "simulacao_folha_proposta",
  //       "simulacao_imovel",
  //       "simulacao_caminhao",
  //       "simulacao_maquinario",
  //       "simulacao_veiculo",

  const simulationImages = [
    {
      title: "Folha de Proposta ( 3500px vs 2048px)",
      aspect: 21 / 29.7,
      defaultImage: configs.simulacao_folha_proposta || "",
      field: "simulacao_folha_proposta",
      filename: "simulacao_folha_proposta",
      description: "Arte de Fundo da Folha de Proposta",
    },
    {
      title: "Icone de Imovel",
      aspect: 500 / 400,
      defaultImage: configs.simulacao_imovel || "",
      field: "simulacao_imovel",
      filename: "simulacao_imovel",
      description: "Icone de Imovel que fica na folha de proposta",
    },
    {
      title: "Icone de Caminhão",
      aspect: 500 / 400,
      defaultImage: configs.simulacao_caminhao || "",
      field: "simulacao_caminhao",
      filename: "simulacao_caminhao",
      description: "Icone de Caminhão que fica na folha de proposta",
    },
    {
      title: "Icone de Maquinário",
      aspect: 500 / 400,
      defaultImage: configs.simulacao_maquinario || "",
      field: "simulacao_maquinario",
      filename: "simulacao_maquinario",
      description: "Icone de Imovel que fica na folha de proposta",
    },
    {
      title: "Icone de Veiculo",
      aspect: 500 / 400,
      defaultImage: configs.simulacao_veiculo || "",
      field: "simulacao_veiculo",
      filename: "simulacao_veiculo",
      description: "Icone de Veiculo que fica na folha de proposta",
    },
  ];

  // Adicione os outros banners de simulação conforme necessário
  // Exemplo de banners de simulação adicionais
  // Coloca os ids de cada imagem
  return {
    crmImages: crmImages.map((image, index) => ({ ...image, id: index + 1 })),
    simulationImages: simulationImages.map((image, index) => ({
      ...image,
      id: crmImages.length + index + 1,
    })),
  };
}

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
  const { crmImages, simulationImages } = await createImageList();



  // Buscando dados no servidor
  const productions = await getProductions();
  const activeProduction = await getActiveProduction();

  // Exemplo de data (apenas para ilustrar)
  const today = dayjs().format("YYYY-MM-DD");

  // Aqui você pode buscar outras informações, como configs do sistema   etc.

  const roles = await prisma.role.findMany({
    include: {
      users: true,
    },
    orderBy: {},
  });

  // Monta o objeto de dados que será repassado ao componente client
  const relatedData = {
    productions,
    activeProduction,
    today,
    roles,
    crmImages,
    simulationImages,
  };

  return <ConfiguracaoCliente relatedData={relatedData} />;
}
