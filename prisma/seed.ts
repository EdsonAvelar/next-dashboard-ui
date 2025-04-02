import { PrismaClient, NegocioStatus } from "@prisma/client";
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
  // 1. Cria cargos, se ainda não existirem (modelo global)
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
      await prisma.cargo.create({ data: { ...cargo, tenant: { connect: { id: tenantId } } } });
    } catch (e) {
      // Ignora erro se já existir
    }
  }

  // 2. Cria usuários (Funcionários) associados ao tenant Representação
  const cargos = await prisma.cargo.findMany();
  const userPromises = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const name = `User ${i + 1}`;
    const email = `user${i + 1}@example.com`;
    const passwordHash = await bcrypt.hash("password", 10);
    const randomCargo = cargos[Math.floor(Math.random() * cargos.length)];
    // 30% de chance de receber a role "gerenciar_equipe"
    let rolesToConnect: { id: number }[] = [];

    const timeComercialRole = await prisma.role.findFirst({
      where: { name: "time_comercial" },
    });
    if (timeComercialRole) {
      rolesToConnect.push({ id: timeComercialRole.id });
    }

    if (Math.random() < 0.3) {
      const role = await prisma.role.findFirst({
        where: { name: "gerenciar_equipe" },
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
  // Seleciona usuários elegíveis: que tenham a role "gerenciar_equipe" e não pertençam a nenhuma equipe nem liderem outra
  const potentialLeaders = await prisma.user.findMany({
    where: {
      roles: { some: { name: "gerenciar_equipe" } },
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

    // Certifique-se de que exista o funil "VENDAS"
    let funil = await prisma.funil.findFirst({
      where: { nome: "VENDAS", tenantId: tenantId },
    });
    if (!funil) {
      funil = await prisma.funil.create({
        data: { nome: "VENDAS", tenantId: tenantId },
      });
    }

    // Obter uma etapa aleatória do funil
    const etapas = await prisma.etapaFunil.findMany({
      where: { funil_id: funil.id, tenantId: tenantId },
    });
    const randomEtapa = etapas[Math.floor(Math.random() * etapas.length)];

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
  // 1. Cria roles/permissões (modelo global)
  const permissionsData = [
    {
      name: "gerente_geral",
      descricao: "Permite acesso total ao sistema sem restrições",
    },
    {
      name: "time_comercial",
      descricao:
        "Permite acesso ao pipeline, pertencer a equipe e ser visto nos rankings",
    },
    {
      name: "gerenciar_funcionarios",
      descricao: "Permite adicionar ou remover funcionarios",
    },
    {
      name: "importar_leads",
      descricao: "Permite ter acesso a área de importação de leads",
    },
    {
      name: "gerenciar_equipe",
      descricao: "Permite um usuário poder ser líder de uma equipe",
    },
    {
      name: "gerenciar_vendas",
      descricao: "Permite enxergar a área de vendas realizadas",
    },
    {
      name: "gerenciar_bordero",
      descricao: "Permite enxergar e gerenciar a área de criação de bordero",
    },
    {
      name: "enviar_notificacao",
      descricao: "Permite enviar notificações de vendas",
    },
    {
      name: "gerenciar_filiais",
      descricao: "Permite enxergar a área de filiais",
    },
  ];

  for (const permission of permissionsData) {
    try {
      await prisma.role.create({ data: permission });
    } catch (e) {
      // Ignora se a role já existir
    }
  }
  console.log("Permissões criadas com sucesso!");

  // 2. Cria três tenants: Master, Submaster e Representação
  const tenantMaster = await prisma.tenant.create({
    data: {
      name: "Master Tenant",
      type: "MASTER",
      billingFrequency: "MENSAL",
    },
  });
  const tenantSubmaster = await prisma.tenant.create({
    data: {
      name: "Submaster Tenant",
      type: "SUBMASTER",
      billingFrequency: "MENSAL",
    },
  });
  const tenantRepresentacao = await prisma.tenant.create({
    data: {
      name: "Representação Tenant",
      type: "REPRESENTATION",
      billingFrequency: "MENSAL",
    },
  });
  console.log("Tenants criados com sucesso!");

  // 3. Cria um usuário Admin para cada tenant usando a role "gerente_geral"
  const passwordHash = await bcrypt.hash("12345", 10);
  const gerenteGeral = await prisma.role.findFirst({
    where: { name: "gerente_geral" },
  });
  if (!gerenteGeral) {
    throw new Error("Role 'gerente_geral' não encontrada!");
  }

  await prisma.user.create({
    data: {
      name: "Admin Master",
      avatar: "",
      email: "adminmaster@example.com",
      password: passwordHash,
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
      password: passwordHash,
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
      password: passwordHash,
      roles: { connect: { id: gerenteGeral.id } },
      status: 1,
      tenantId: tenantRepresentacao.id,
    },
  });
  console.log("Usuários Admin criados para cada tenant!");

  // 4. Cria cargos (mesmo processo que no populateCRM)
  const cargoData = [
    { name: "Gerente" },
    { name: "Vendedor" },
    { name: "Coordenador" },
    { name: "Supervisor" },
    { name: "Telemarketing" },
    { name: "Gerente Adminstrativo" },
    { name: "Auxiliar Adminstrativo" },
    { name: "Pós-Venda" },
  ];
  for (const cargo of cargoData) {
    try {
      await prisma.cargo.create({ data: { ...cargo, tenant: { connect: { id: tenantRepresentacao.id } } } });
    } catch (e) {
      // Ignora se já existir
    }
  }
  console.log("Cargos criados com sucesso!");

  // 5. Cria o funil e as etapas (associados ao tenant Representação)
  const funil = await prisma.funil.create({
    data: { nome: "VENDAS", tenantId: tenantRepresentacao.id },
  });

  await prisma.etapaFunil.createMany({
    data: [
      {
        nome: "OPORTUNIDADE",
        ordem: 1,
        funil_id: funil.id,
        tipo: "COMUM",
        tenantId: tenantRepresentacao.id,
      },
      {
        nome: "PRIMEIRO_CONTATO",
        ordem: 2,
        funil_id: funil.id,
        tipo: "COMUM",
        tenantId: tenantRepresentacao.id,
      },
      {
        nome: "REUNIAO_AGENDADA",
        ordem: 3,
        funil_id: funil.id,
        tipo: "AGENDAMENTO",
        tenantId: tenantRepresentacao.id,
      },
      {
        nome: "REUNIAO",
        ordem: 4,
        funil_id: funil.id,
        tipo: "REUNIAO",
        tenantId: tenantRepresentacao.id,
      },
      {
        nome: "APROVACAO",
        ordem: 5,
        funil_id: funil.id,
        tipo: "COMUM",
        tenantId: tenantRepresentacao.id,
      },
      {
        nome: "ACOMPANHAMENTO",
        ordem: 6,
        funil_id: funil.id,
        tipo: "COMUM",
        tenantId: tenantRepresentacao.id,
      },
      {
        nome: "FECHAMENTO",
        ordem: 7,
        funil_id: funil.id,
        tipo: "FECHAMENTO",
        tenantId: tenantRepresentacao.id,
      },
    ],
  });
  console.log('Pipeline "VENDAS" criado com sucesso!');

  // 6. Popula o CRM (restante dos dados) para o tenant Representação
  await populateCRM(20, 50, tenantRepresentacao.id);
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
