import {
  PrismaClient,
  NegocioStatus,
  TenantType,
  BillingFrequency,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Função auxiliar para gerar uma string aleatória
function randomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Cria dados do CRM para um tenant específico (no caso, Representação)
 */
export async function populateCRM(
  NUM_USERS: number,
  NUM_NEGOCIOS: number,
  tenantId: number
) {
  // 1. Cria cargos para o tenant Representação
  const cargosData = [
    { name: "Gerente" },
    { name: "Vendedor" },
    { name: "Coordenador" },
    { name: "Supervisor" },
    { name: "Telemarketing" },
    { name: "Gerente Administrativo" },
    { name: "Auxiliar Administrativo" },
    { name: "Pós-Venda" },
  ];
  for (const cargo of cargosData) {
    try {
      await prisma.cargo.create({
        data: {
          ...cargo,
          scope: TenantType.REPRESENTATION,
        },
      });
    } catch (e) {
      // Ignora erro se já existir
    }
  }

  // 2. Cria usuários (Funcionários) associados ao tenant Representação
  // Agora, busca cargos filtrando pelo scope, pois Cargo não possui relação com Tenant.
  const cargos = await prisma.cargo.findMany({
    where: { scope: TenantType.REPRESENTATION },
  });
  const userPromises = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const name = `User ${i + 1}`;
    const email = `user${i + 1}@example.com`;
    const passwordHash = await bcrypt.hash("password", 10);
    const randomCargo = cargos[Math.floor(Math.random() * cargos.length)];

    // Conecta as roles disponíveis para REPRESENTATION
    let rolesToConnect: { id: number }[] = [];
    const timeComercialRole = await prisma.role.findFirst({
      where: { name: "time_comercial", scope: TenantType.REPRESENTATION },
    });
    if (timeComercialRole) {
      rolesToConnect.push({ id: timeComercialRole.id });
    }
    if (Math.random() < 0.3) {
      const role = await prisma.role.findFirst({
        where: { name: "gerenciar_equipe", scope: TenantType.REPRESENTATION },
      });
      if (role) rolesToConnect.push({ id: role.id });
    }
    userPromises.push(
      prisma.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          status: 1,
          cargoId: randomCargo.id,
          roles: { connect: rolesToConnect },
          tenantId: tenantId,
        },
      })
    );
  }
  const users = await Promise.all(userPromises);
  console.log(`${NUM_USERS} usuários criados no tenant Representação.`);

  // 3. Cria equipes associadas ao tenant Representação
  const potentialLeaders = await prisma.user.findMany({
    where: {
      roles: {
        some: { name: "gerenciar_equipe", scope: TenantType.REPRESENTATION },
      },
      equipeId: null,
      liderEquipe: null,
      tenantId: tenantId,
    },
    select: { id: true, name: true },
  });
  const NUM_EQUIPES = Math.min(5, potentialLeaders.length);
  const equipePromises = [];
  for (let i = 0; i < NUM_EQUIPES; i++) {
    const leader = potentialLeaders[i];
    equipePromises.push(
      prisma.equipe.create({
        data: {
          name: `Equipe ${randomString(5)}`,
          description: `Descrição da equipe ${i + 1}`,
          logo: "https://via.placeholder.com/40",
          liderId: leader.id,
          tenantId: tenantId,
        },
      })
    );
  }
  const equipes = await Promise.all(equipePromises);
  console.log(`${NUM_EQUIPES} equipes criadas no tenant Representação.`);

  // 4. Atribui membros aleatórios às equipes
  const remainingUsers = await prisma.user.findMany({
    where: {
      equipeId: null,
      id: { notIn: equipes.map((eq) => eq.liderId) },
      tenantId: tenantId,
    },
  });
  for (const user of remainingUsers) {
    if (Math.random() < 0.5 && equipes.length > 0) {
      const randomEquipe = equipes[Math.floor(Math.random() * equipes.length)];
      await prisma.user.update({
        where: { id: user.id },
        data: { equipeId: randomEquipe.id },
      });
    }
  }
  console.log("Membros atribuídos às equipes.");

  // 5. Cria negócios, leads, agendamentos, fechamentos, etc. no tenant Representação
  // Cria o funil se não existir
  let funil = await prisma.funil.findFirst({
    where: { nome: "VENDAS", tenantId: tenantId },
  });
  if (!funil) {
    funil = await prisma.funil.create({
      data: { nome: "VENDAS", tenantId: tenantId },
    });
  }

  // Gera etapas caso ainda não existam
  const etapas = await prisma.etapaFunil.findMany({
    where: { funil_id: funil.id, tenantId: tenantId },
  });
  if (etapas.length === 0) {
    await prisma.etapaFunil.createMany({
      data: [
        {
          nome: "OPORTUNIDADE",
          ordem: 1,
          funil_id: funil.id,
          tipo: "COMUM",
          tenantId: tenantId,
        },
        {
          nome: "PRIMEIRO_CONTATO",
          ordem: 2,
          funil_id: funil.id,
          tipo: "COMUM",
          tenantId: tenantId,
        },
        {
          nome: "REUNIAO_AGENDADA",
          ordem: 3,
          funil_id: funil.id,
          tipo: "AGENDAMENTO",
          tenantId: tenantId,
        },
        {
          nome: "REUNIAO",
          ordem: 4,
          funil_id: funil.id,
          tipo: "REUNIAO",
          tenantId: tenantId,
        },
        {
          nome: "APROVACAO",
          ordem: 5,
          funil_id: funil.id,
          tipo: "COMUM",
          tenantId: tenantId,
        },
        {
          nome: "ACOMPANHAMENTO",
          ordem: 6,
          funil_id: funil.id,
          tipo: "COMUM",
          tenantId: tenantId,
        },
        {
          nome: "FECHAMENTO",
          ordem: 7,
          funil_id: funil.id,
          tipo: "FECHAMENTO",
          tenantId: tenantId,
        },
      ],
    });
  }

  // Cria negócios e informações associadas
  for (let i = 0; i < NUM_NEGOCIOS; i++) {
    // Cria um lead fake
    const lead = await prisma.lead.create({
      data: {
        nome: `Lead ${randomString(5)}`,
        telefone: `555-010${i}`,
        whatsapp: `555-010${i}`,
        email: `lead${i}@example.com`,
        tenantId: tenantId,
      },
    });

    // Escolhe um usuário aleatório como dono
    const randomUser = users[Math.floor(Math.random() * users.length)];

    // Obter uma etapa aleatória do funil
    const etapasFunil = await prisma.etapaFunil.findMany({
      where: { funil_id: funil.id, tenantId: tenantId },
    });
    const randomEtapa =
      etapasFunil[Math.floor(Math.random() * etapasFunil.length)];

    // Array com os status possíveis
    const statusOptions = [
      NegocioStatus.ATIVO,
      NegocioStatus.VENDIDO,
      NegocioStatus.PERDIDO,
    ];
    const randomStatus =
      statusOptions[Math.floor(Math.random() * statusOptions.length)];

    const randomValor = parseFloat(
      (Math.random() * (500000 - 50000) + 50000).toFixed(2)
    );

    const negocio = await prisma.negocio.create({
      data: {
        titulo: `Negocio ${randomString(4)}`,
        tipo: "IMOVEL",
        status: randomStatus,
        valor: randomValor,
        consorciado: { connect: { id: lead.id } },
        funil: { connect: { id: funil.id } },
        etapa_funil: { connect: { id: randomEtapa.id } },
        user: { connect: { id: randomUser.id } },
        tenant: { connect: { id: tenantId } },
      },
    });

    // Cria um agendamento para o negócio
    await prisma.agendamento.create({
      data: {
        dataAgendado: new Date(Date.now() + i * 86400000),
        hora: "10:00",
        status: "pendente",
        negocio: { connect: { id: negocio.id } },
        user: { connect: { id: randomUser.id } },
        tenant: { connect: { id: tenantId } },
      },
    });

    // Opcional: Cria um fechamento para 50% dos negócios
    const fechamentoStatusOptions = ["FECHADA", "RASCUNHO", "CANCELADA"];
    const randomFechamentoStatus =
      fechamentoStatusOptions[
        Math.floor(Math.random() * fechamentoStatusOptions.length)
      ];

    if (Math.random() < 0.5) {
      await prisma.fechamento.create({
        data: {
          data_fechamento: new Date(),
          status: randomFechamentoStatus,
          grupo: "Grupo " + (i + 1),
          cota: "Cota " + (i + 1),
          especie: "Especie",
          marca: "Marca " + randomString(3),
          modelo: "Modelo " + randomString(2),
          tipo_plano: "Tipo " + randomString(2),
          plano_leve: "Plano",
          seguro_prestamista: "Sim",
          codigo_bem: "COD" + randomString(4),
          preco_bem: randomValor,
          duracao_grupo: 12,
          duracao_plano: 24,
          grupo_em_formacao: false,
          numero_assembleia_adesao: i + 1,
          data_assembleia: new Date(),
          pagamento_incorporado: 500.0,
          pagamento_ate_contemplacao: 1000.0,
          numero_contrato: i + 100,
          parcela: 100.0,
          parcela_antecipada: 50.0,
          total_antecipado: 500.0,
          adesao: 100.0,
          primeira_parcela: 100.0,
          total_pago: 1000.0,
          forma_pagamento: "Dinheiro",
          negocio: { connect: { id: negocio.id } },
          tenant: { connect: { id: tenantId } },
        },
      });
    }
  }
  console.log(`${NUM_NEGOCIOS} negócios criados no tenant Representação.`);

  const today = new Date();

  // Produção 1: Inicia 30 dias antes e termina 1 dia antes de hoje
  const production1Start = new Date(today);
  production1Start.setDate(today.getDate() - 30);
  const production1End = new Date(today);
  production1End.setDate(today.getDate() - 1);

  // Produção 2: Inicia hoje e finaliza daqui a 30 dias
  const production2Start = new Date(today);
  const production2End = new Date(today);
  production2End.setDate(today.getDate() + 30);

  await prisma.producao.create({
    data: {
      name: "Produção Anterior",
      startDate: production1Start,
      endDate: production1End,
      isActive: false,
      tenantId: tenantId,
    },
  });

  await prisma.producao.create({
    data: {
      name: "Produção Atual",
      startDate: production2Start,
      endDate: production2End,
      isActive: true,
      tenantId: tenantId,
    },
  });

  console.log("Produções criadas com sucesso!");
}

async function main() {
  // 1. Cria roles (para REPRESENTATION)
  const rolesData = [
    {
      name: "gerente_geral",
      descricao: "Permite acesso total ao sistema sem restrições",
      scope: TenantType.REPRESENTATION,
    },
    {
      name: "time_comercial",
      descricao:
        "Permite acesso ao pipeline, pertencer a equipe e ser visto nos rankings",
      scope: TenantType.REPRESENTATION,
    },
    {
      name: "gerenciar_funcionarios",
      descricao: "Permite adicionar ou remover funcionários",
      scope: TenantType.REPRESENTATION,
    },
    {
      name: "importar_leads",
      descricao: "Permite acesso à área de importação de leads",
      scope: TenantType.REPRESENTATION,
    },
    {
      name: "gerenciar_equipe",
      descricao: "Permite que um usuário seja líder de uma equipe",
      scope: TenantType.REPRESENTATION,
    },
    {
      name: "gerenciar_vendas",
      descricao: "Permite visualizar a área de vendas realizadas",
      scope: TenantType.REPRESENTATION,
    },
    {
      name: "gerenciar_bordero",
      descricao: "Permite gerenciar a área de criação de bordero",
      scope: TenantType.REPRESENTATION,
    },
    {
      name: "enviar_notificacao",
      descricao: "Permite enviar notificações de vendas",
      scope: TenantType.REPRESENTATION,
    },
    {
      name: "gerenciar_filiais",
      descricao: "Permite acesso à área de filiais",
      scope: TenantType.REPRESENTATION,
    },
  ];

  for (const role of rolesData) {
    try {
      await prisma.role.create({
        data: { ...role },
      });
    } catch (e) {
      // Ignora se a role já existir
    }
  }
  console.log("Roles para REPRESENTATION criadas com sucesso!");

  // 2. Cria três tenants: Master, Submaster e Representação
  const tenantMaster = await prisma.tenant.create({
    data: {
      name: "Master Tenant",
      type: TenantType.MASTER,
      billingFrequency: BillingFrequency.MENSAL,
    },
  });
  const tenantSubmaster = await prisma.tenant.create({
    data: {
      name: "Submaster Tenant",
      type: TenantType.SUBMASTER,
      billingFrequency: BillingFrequency.MENSAL,
    },
  });
  const tenantRepresentacao = await prisma.tenant.create({
    data: {
      name: "Representação Tenant",
      type: TenantType.REPRESENTATION,
      billingFrequency: BillingFrequency.MENSAL,
    },
  });
  console.log("Tenants criados com sucesso!");

  // 3. (Removido) Atualizar as roles para conectar com o tenant Representação,
  // pois o modelo Role não possui relação many-to-many com Tenant.

  // 4. Cria um usuário Admin para cada tenant usando a role "gerente_geral"
  const senhaHash = await bcrypt.hash("12345", 10);
  const gerenteGeral = await prisma.role.findFirst({
    where: { name: "gerente_geral", scope: TenantType.REPRESENTATION },
  });
  if (!gerenteGeral) {
    throw new Error("Role 'gerente_geral' não encontrada!");
  }
  await prisma.user.create({
    data: {
      name: "Admin Master",
      avatar: "",
      email: "adminmaster@example.com",
      password: senhaHash,
      roles: { connect: { id: gerenteGeral.id } },
      status: 1,
      tenantId: tenantMaster.id,
    },
  });
  await prisma.user.create({
    data: {
      name: "Admin Submaster",
      avatar: "",
      email: "adminsubmaster@example.com",
      password: senhaHash,
      roles: { connect: { id: gerenteGeral.id } },
      status: 1,
      tenantId: tenantSubmaster.id,
    },
  });
  await prisma.user.create({
    data: {
      name: "Admin Representação",
      avatar: "",
      email: "adminrepresentacao@example.com",
      password: senhaHash,
      roles: { connect: { id: gerenteGeral.id } },
      status: 1,
      tenantId: tenantRepresentacao.id,
    },
  });
  console.log("Usuários Admin criados para cada tenant!");

  // 5. Inicia a população do CRM para o tenant Representação
  console.log("Iniciando a população do CRM para o tenant Representação...");
  await populateCRM(20, 50, tenantRepresentacao.id);

  console.log("Seed concluído com sucesso!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
