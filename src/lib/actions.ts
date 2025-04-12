"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NegocioTipo } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import {
  EquipeSchema,
  FechamentoSchema,
  FuncionarioSchema,
  NegocioSchema,
  ProductionSchema,
} from "./formValidationSchema";
import { formatNumberShort, parseDateUsa } from "./utils";

type CurrentState = { success: boolean; msg: string };

export const createNegocio = async (
  currentState: CurrentState,
  data: NegocioSchema
) => {
  try {
    const tenantId = await getTenantID();

    const lead = await prisma.lead.create({
      data: {
        nome: data.nome_contato,
        telefone: data.telefone,
        whatsapp: data.whatsapp || "",
        email: data.email || "",
        tenantId: tenantId,
      },
    });

    // Se existir o parâmetro proprietario_id, prepara a conexão com o usuário
    const userConnection = data.proprietario_id
      ? { user: { connect: { id: parseInt(data.proprietario_id, 10) } } }
      : {};

    const valor = formatNumberShort(data.valor || 0);

    await prisma.negocio.create({
      data: {
        titulo:
          data.titulo ||
          `Negócio ${data.nome_contato.split(" ")[0]} - ${data.tipo}${valor ? " - " + valor : ""}`,
        tenant: { connect: { id: tenantId } },
        // Os campos "tipo" e "status" devem ser definidos conforme seu enum
        tipo: data.tipo as NegocioTipo,
        status: "ATIVO", // ou outro valor padrão, conforme seu enum NegocioStatus
        // Conectando o Lead criado:
        consorciado: { connect: { id: lead.id } },
        // Conectando outros relacionamentos, utilizando os IDs recebidos ou definidos no form:
        valor: data.valor,
        funil: { connect: { id: 1 } },
        etapa_funil: { connect: { id: 1 } },
        ...userConnection,
      },
    });

    return { success: true, msg: "" };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Erro ao criar negócio" };
  }
};

export const updateNegocio = async (
  currentState: CurrentState,
  data: NegocioSchema
) => {
  try {
    const negocio = await prisma.negocio.update({
      where: {
        id: data.id,
      },
      data: {
        titulo:
          data.titulo ||
          `Negócio ${data.nome_contato.split(" ")[0]} - ${data.tipo}${data.valor ? " - " + data.valor : ""}`,
        // Os campos "tipo" e "status" devem ser definidos conforme seu enum
        tipo: data.tipo as NegocioTipo,
        status: "ATIVO", // ou outro valor padrão, conforme seu enum NegocioStatus
        // Conectando o Lead criado:

        // Conectando outros relacionamentos, utilizando os IDs recebidos ou definidos no form:
        funil: { connect: { id: 1 } },
        etapa_funil: { connect: { id: 1 } },
      },
    });
    // revalidatePath("/negocios/lista");

    return { success: true, msg: "Negocio Atualizado com Sucesso" };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Erro ao Atualizar Negocio" + error };
  }
};

// Tipo para os registros importados em massa
type MassNegocioData = {
  tipo: string;
  proprietario_id?: string;
  registros: {
    name: string;
    telefone: string;
    credito?: number | null;
  }[];
};

export const createMassNegocio = async (
  currentState: CurrentState,
  data: MassNegocioData
) => {
  try {
    const tenantId = await getTenantID();

    // Para cada registro, cria o Lead e o Negócio correspondente
    for (const registro of data.registros) {
      // Criação do lead
      const lead = await prisma.lead.create({
        data: {
          nome: registro.name,
          telefone: registro.telefone,
          tenantId: tenantId,
        },
      });

      // Se existir o parâmetro proprietario_id, prepara a conexão com o usuário
      const userConnection = data.proprietario_id
        ? { user: { connect: { id: parseInt(data.proprietario_id, 10) } } }
        : {};

      // Cria um título padrão, combinando o primeiro nome com o tipo de crédito
      const titulo =
        `${registro.name.split(" ")[0]} - ${data.tipo}` +
        (registro.credito ? ` - ${formatNumberShort(registro.credito)}` : "");

      // Criação do negócio
      await prisma.negocio.create({
        data: {
          titulo,
          // Define o tipo conforme o enum; ajuste se necessário
          tipo: data.tipo as NegocioTipo,
          tenant: { connect: { id: tenantId } },
          status: "ATIVO", // ou outro valor padrão conforme seu enum de status
          // Conectando o Lead criado
          consorciado: { connect: { id: lead.id } },
          // Conexões padrão com Funil e Etapa do Funil (ajuste conforme sua lógica)
          funil: { connect: { id: 1 } },
          etapa_funil: { connect: { id: 1 } },
          valor: registro.credito || null,
          ...userConnection,
        },
      });
    }

    // Caso esteja usando revalidation, descomente a linha abaixo:
    // revalidatePath("/negocios/lista");

    return { success: true, msg: "" };
  } catch (error) {
    console.error("Erro ao criar negócios massivos:", error);
    return { success: false, msg: "Erro ao criar negócios" };
  }
};

export const createUser = async (
  currentState: CurrentState,
  data: FuncionarioSchema
) => {
  try {
    const passwordHash = await bcrypt.hash(data.password, 10);

    const newFuncionario = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: passwordHash, // Em produção, lembre-se de hashear a senha!
        avatar: "/noAvatar.png",
        cargo: { connect: { id: parseInt(data.cargo) } },
        status: 1,
      },
    });

    return { success: true, msg: `Usuário ${data.name} criado com sucesso` };
  } catch (error) {
    console.log(error);
    return { success: true, msg: "Erro ao criar funcionario" };
  }
};

export const updateUser = async (
  currentState: CurrentState,
  data: FuncionarioSchema
) => {
  try {
    const passwordHash = await bcrypt.hash(data.password, 10);

    const newFuncionario = await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        email: data.email,
        password: passwordHash, // Em produção, lembre-se de hashear a senha!
        endereco: data.endereco,
        telefone: data.telefone,
        cpf: data.cpf,
        data_contratacao: data.data_contratacao,
        cargo: { connect: { id: parseInt(data.cargo) } },
        status: 1,
      },
    });

    return {
      success: true,
      msg: `Usuário ${data.name} atualizado com sucesso`,
    };
  } catch (error) {
    console.log(error);
    return { success: true, msg: "Erro ao criar funcionario" };
  }
};

export const deleteFuncionario = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;

    const newFuncionario = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    return {
      success: true,
      msg: `Usuário deletado com sucesso`,
    };
  } catch (error) {
    console.log(error);
    return { success: true, msg: "Erro ao criar funcionario" };
  }
};

export async function getCargos() {
  try {
    const cargos = await prisma.cargo.findMany();

    const options = cargos.map((cargo) => ({
      value: cargo.id.toString(), // Converte para string
      label: cargo.name,
    }));

    return options;
  } catch (error) {
    return [];
  }
}

// Defina um tipo para o perfil do usuário
export type UserProfile = {
  id: number;
  name: string;
  avatar: string;
  telefone: string;
  cpf: string;
  rg: string;
  endereco: string;
  cargo: { id: number; name: string };
  data_contratacao: string;
  status: string | number;
  equipe: { name: string };
  email: string;
  roles: any[]; // ajuste o tipo conforme sua aplicação
  tenantId: number;
};

const defaultUser: UserProfile = {
  id: 0,
  name: "Sem nome",
  avatar: "/noAvatar.png",
  telefone: "",
  cpf: "",
  rg: "",
  endereco: "",
  cargo: { id: 0, name: "" },
  data_contratacao: "",
  status: "",
  equipe: { name: "" },
  email: "",
  roles: [],
  tenantId: 0,
};

export async function getUserProfile({
  id,
}: {
  id: string;
}): Promise<UserProfile> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        telefone: true,
        cpf: true,
        rg: true,
        endereco: true,
        cargo: true,
        data_contratacao: true,
        status: true,
        equipe: {
          select: { name: true },
        },
        email: true,
        roles: true,
        tenantId: true,
      },
    });

    const defaultUserFilled = {
      id: user?.id || defaultUser.id,
      name: user?.name || defaultUser.name,
      avatar: user?.avatar || defaultUser.avatar,
      telefone: user?.telefone || defaultUser.telefone,
      cpf: user?.cpf || defaultUser.cpf,
      rg: user?.rg || defaultUser.rg,
      endereco: user?.endereco || defaultUser.endereco,
      cargo: user?.cargo || defaultUser.cargo,
      data_contratacao: user?.data_contratacao || defaultUser.data_contratacao,
      status: user?.status || defaultUser.status,
      equipe: { name: user?.equipe?.name || defaultUser.equipe.name },
      email: user?.email || defaultUser.email,
      roles: user?.roles || defaultUser.roles,
      tenantId: user?.tenantId || defaultUser.tenantId,
    };

    return defaultUserFilled;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return defaultUser;
  }
}

export async function getCurrentUser(): Promise<UserProfile> {
  const session = await getServerSession(authOptions);

  // const userName = session?.user?.name || "Guest";
  // const cargo = session?.user?.cargo || "Sem Cargo";
  // const avatar = session?.user?.avatar || "/noAvatar";
  const currentId = session?.user?.id || null;

  try {
    if (currentId) {
      return getUserProfile({ id: currentId });
    } else {
      return defaultUser;
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return defaultUser;
  }
}

// Ação de servidor para atribuir um negócio
export async function assignNegocio(
  currentState: CurrentState,
  formData: FormData
): Promise<CurrentState> {
  try {
    const negocioId = formData.get("negocioId") as string;
    const userId = formData.get("userId") as string; // pode ser vazio
    const etapaId = formData.get("etapaId") as string; // pode ser vazio

    // Atualiza o negócio no banco
    await prisma.negocio.update({
      where: { id: parseInt(negocioId, 10) },
      data: {
        // Se userId for vazio, desconecta proprietário; senão, conecta
        user: userId
          ? { connect: { id: parseInt(userId, 10) } }
          : { disconnect: true },

        // Se etapaId for vazio, não mexe; senão, conecta a nova etapa
        etapa_funil: etapaId
          ? { connect: { id: parseInt(etapaId, 10) } }
          : undefined,
      },
    });

    // Caso queira recarregar alguma rota, use revalidatePath("/negocios/lista") ou similar
    return { success: true, msg: "Negócio atribuído com sucesso!" };
  } catch (error) {
    console.error("Erro ao atribuir negócio:", error);
    return { success: false, msg: "Erro ao atribuir negócio" };
  }
}

export async function assignMassNegocios(
  currentState: CurrentState,
  formData: FormData
) {
  try {
    const tenantId = await getTenantID();

    // Recebe os campos do formulário
    const negocioIdsStr = formData.get("negocioIds") as string; // JSON com array de números
    const proprietarioIdStr = formData.get("proprietarioId") as string;
    const etapaIdStr = formData.get("etapaId") as string;
    const modelStr = formData.get("model") as string; // ação a ser realizada

    if (!modelStr) {
      return { success: false, msg: "Modelo não definido" };
    }

    // Converte os valores
    const negocioIds: number[] = JSON.parse(negocioIdsStr);
    const proprietarioId = proprietarioIdStr
      ? parseInt(proprietarioIdStr, 10)
      : null;
    const etapaId = etapaIdStr ? parseInt(etapaIdStr, 10) : null;

    if (modelStr === "leadImportado") {
      // Para cada ID recebido, tratamento como ID de leadImportado
      for (const id of negocioIds) {
        // Busca o registro importado (leadImportado)
        const importedLead = await prisma.leadImportado.findUnique({
          where: { id },
        });

        if (!importedLead) continue;

        const existingLead = await prisma.lead.findFirst({
          where: { telefone: importedLead.telefone, tenantId },
        });

        const newLead = existingLead
          ? existingLead
          : await prisma.lead.create({
              data: {
                nome: importedLead.nome,
                telefone: importedLead.telefone,
                email: importedLead.email || "",
                tenantId: tenantId,
              },
            });
        // Cria o lead na tabela principal "lead"
        // const newLead = await prisma.lead.create({
        //   data: {
        //     nome: importedLead.nome,
        //     telefone: importedLead.telefone,
        //     email: importedLead.email || "",
        //     tenantId: tenantId,
        //   },
        // });

        // Se existir o parâmetro proprietario_id, prepara a conexão com o usuário
        const userConnection = proprietarioId
          ? { user: { connect: { id: proprietarioId } } }
          : {};

        // Cria um título padrão para o novo negócio
        const titulo = `${newLead.nome.split(" ")[0]} - ${importedLead.tipo}`;

        // Cria o negócio com base no lead importado
        await prisma.negocio.create({
          data: {
            titulo,
            tenant: { connect: { id: tenantId } },
            tipo: importedLead.tipo as NegocioTipo,
            status: "ATIVO",
            consorciado: { connect: { id: newLead.id } },
            funil: { connect: { id: 1 } },
            etapa_funil: etapaId ? { connect: { id: etapaId } } : undefined,
            ...userConnection,
          },
        });

        // Remove o registro importado da tabela leadImportado
        await prisma.leadImportado.delete({
          where: { id },
        });
      }
    } else if (modelStr === "negocio") {
      // Atualiza cada negócio, conforme a lógica existente
      await Promise.all(
        negocioIds.map((id) =>
          prisma.negocio.update({
            where: { id },
            data: {
              user: proprietarioId
                ? { connect: { id: proprietarioId } }
                : { disconnect: true },
              etapa_funil: etapaId ? { connect: { id: etapaId } } : undefined,
            },
          })
        )
      );
    }

    // Atualiza cada negócio (supondo que o relacionamento seja many-to-one com User e many-to-one com EtapaFunil)
    // await Promise.all(
    //   negocioIds.map((id) =>
    //     prisma.negocio.update({
    //       where: { id },
    //       data: {
    //         // Atualiza o proprietário: se não selecionado, desconecta
    //         user: proprietarioId
    //           ? { connect: { id: proprietarioId } }
    //           : { disconnect: true },
    //         // Atualiza a etapa do funil, se selecionada (se não, não altera ou pode desconectar)
    //         etapa_funil: etapaId ? { connect: { id: etapaId } } : undefined,
    //       },
    //     })
    //   )
    // );

    const updatedCount = negocioIds.length;
    return {
      success: true,
      msg: `Negócios atribuídos com sucesso! Total: ${updatedCount}`,
    };
  } catch (error) {
    console.error("Erro na atribuição em massa:", error);
    return { success: false, msg: "Erro ao atribuir negócios." };
  }
}

export async function criarReuniao(
  currentState: CurrentState,
  negocioId: number
) {
  try {
    const tenantId = await getTenantID();

    // Busca o agendamento para o negócio
    const agendamento = await prisma.agendamento.findFirst({
      where: { negocioId: negocioId },
    });

    // Busca o negócio para obter o usuário (proprietário)
    const negocio = await prisma.negocio.findUnique({
      where: { id: negocioId },
      select: { user_id: true },
    });

    if (!negocio) {
      return { success: false, msg: "Negócio não encontrado" };
    }

    const proprietario_id = negocio.user_id;

    if (agendamento && proprietario_id) {
      // Verifica se já existe reunião para este agendamento
      const reuniao = await prisma.reuniao.findFirst({
        where: { agendamentoId: agendamento.id },
      });

      if (!reuniao) {
        // Cria nova reunião
        await prisma.reuniao.create({
          data: {
            agendamentoId: agendamento.id,
            userId: proprietario_id,
            // Aqui você pode formatar a data conforme necessário.
            // Se o campo for DateTime, new Date() já é suficiente.
            dataReuniao: new Date(),
            tenantId: tenantId,
          },
        });

        return { success: true, msg: "Cliente em Reunião" };
      } else {
        return { success: true, msg: "Reunião já aconteceu anteriormente" };
      }
    } else {
      return { success: false, msg: "Agendamento não foi encontrado" };
    }
  } catch (error) {
    console.error("Erro ao criar reunião:", error);

    return { success: false, msg: "Erro ao criar reunião: " + error };
  }
}

export async function criarAgendamento({
  dataAgendado,
  hora,
  negocioId,
}: {
  dataAgendado: string;
  hora: string;
  negocioId: number;
}) {
  try {
    const tenantId = await getTenantID();

    const negocio = await prisma.negocio.findUnique({
      where: { id: negocioId },
      select: { user_id: true }, // Pegamos apenas o userId
    });

    if (!negocio || !negocio.user_id) {
      return {
        success: false,
        msg: "Negócio não encontrado ou sem usuário associado.",
      };
    }

    await prisma.agendamento.create({
      data: {
        tenant: { connect: { id: tenantId } },
        dataAgendado: new Date(dataAgendado),
        dataAgendamento: new Date(),
        hora,
        negocio: { connect: { id: negocioId } },
        user: { connect: { id: negocio.user_id } },
        status: "pendente",
      },
    });

    return { success: true, msg: "Agendamento criado com sucesso" };
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return { success: false, msg: "Erro ao criar agendamento" };
  }
}

export async function listarAgendamentos() {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        negocio: true,
        user: true,
      },
    });
    return agendamentos;
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    return [];
  }
}

export async function saveStageChange(negocioId: number, etapaId: number) {
  try {
    await prisma.negocio.update({
      where: { id: negocioId },
      data: { etapa_funil_id: etapaId }, // ajuste ao seu schema
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao mover negócio:", error);
    return { success: false, msg: error };
  }
}

export const updateFechamento = async (
  data: FechamentoSchema
): Promise<{ success: boolean; msg: string }> => {
  try {
    const tenantId = await getTenantID();

    // Atualiza os campos do fechamento
    const fechamentoAtualizado = await prisma.fechamento.update({
      where: { negocioId: parseInt(data.negocio_id, 10) },
      data: {
        data_fechamento: data.data_fechamento
          ? new Date(data.data_fechamento)
          : null,
        status: data.status || null,
        especie: data.especie || null,
        grupo: data.grupo || null,
        cota: data.cota || null,
        marca: data.marca || null,
        modelo: data.modelo || null,
        tipo_plano: data.tipo_plano || null,
        plano_leve: data.plano_leve || null,
        seguro_prestamista: data.seguro_prestamista || null,
        codigo_bem: data.codigo_bem || null,
        preco_bem: data.preco_bem ? parseFloat(data.preco_bem) : null,
        duracao_grupo: data.duracao_grupo
          ? parseInt(data.duracao_grupo, 10)
          : null,
        duracao_plano: data.duracao_plano
          ? parseInt(data.duracao_plano, 10)
          : null,
        grupo_em_formacao: data.grupo_em_formacao === "SIM",
        numero_assembleia_adesao: data.numero_assembleia_adesao
          ? parseInt(data.numero_assembleia_adesao, 10)
          : null,
        data_assembleia: data.data_assembleia
          ? new Date(data.data_assembleia)
          : null,
        pagamento_incorporado: data.pagamento_incorporado
          ? parseFloat(data.pagamento_incorporado)
          : null,
        pagamento_ate_contemplacao: data.pagamento_ate_contemplacao
          ? parseFloat(data.pagamento_ate_contemplacao)
          : null,
        numero_contrato: data.numero_contrato
          ? parseInt(data.numero_contrato, 10)
          : null,
        parcela: data.parcela ? parseFloat(data.parcela) : null,
        parcela_antecipada: data.parcela_antecipada
          ? parseFloat(data.parcela_antecipada)
          : null,
        total_antecipado: data.total_antecipado
          ? parseFloat(data.total_antecipado)
          : null,
        adesao: data.adesao ? parseFloat(data.adesao) : null,
        primeira_parcela: data.primeira_parcela
          ? parseFloat(data.primeira_parcela)
          : null,
        total_pago: data.total_pago ? parseFloat(data.total_pago) : null,
        forma_pagamento: data.forma_pagamento || null,
        vendedores: {
          deleteMany: {},
          create:
            data.vendedores && data.vendedores.length > 0
              ? data.vendedores
                  .filter((v) => v.userId !== "")
                  .map((v) => ({
                    userId: parseInt(v.userId, 10),
                    comissao:
                      v.comissao && v.comissao !== "" ? v.comissao : null,
                    modo: v.modo && v.modo !== "" ? v.modo : "OUTROS",
                  }))
              : [],
        },
      },
    });

    // Atualiza os dados dos leads associados ao Negocio (consorciado e cônjuge)
    const negocioAtualizado = await prisma.negocio.update({
      where: { id: parseInt(data.negocio_id, 10) },
      data: {
        consorciado: {
          update: {
            nome: data.consorciado?.nome,
            email: data.consorciado?.email,
            whatsapp: data.consorciado?.whatsapp,
            nome_mae: data.consorciado?.nome_mae,
            nome_pai: data.consorciado?.nome_pai,
            data_nasc: data.consorciado?.data_nasc
              ? new Date(data.consorciado.data_nasc)
              : undefined,
            cpf: data.consorciado?.cpf,
            rg: data.consorciado?.rg,
            orgao_exp: data.consorciado?.orgao_exp,
            nacionalidade: data.consorciado?.nacionalidade,
            naturalidade: data.consorciado?.naturalidade,
            genero: data.consorciado?.genero,
            estado_civil: data.consorciado?.estado_civil,
            formacao: data.consorciado?.formacao,
            profissao: data.consorciado?.profissao,
            renda_liquida: data.consorciado?.renda_liquida,
            endereco: data.consorciado?.endereco,
            numero: data.consorciado?.numero,
            bairro: data.consorciado?.bairro,
            cidade: data.consorciado?.cidade,
            estado: data.consorciado?.estado,
            complemento: data.consorciado?.complemento,
            cep: data.consorciado?.cep,
          },
        },
        conjuge: data.conjuge
          ? {
              upsert: {
                update: {
                  nome: data.conjuge.nome || "",
                  data_nasc: data.conjuge.data_nasc
                    ? new Date(data.conjuge.data_nasc)
                    : undefined,
                  cpf: data.conjuge.cpf,
                  rg: data.conjuge.rg,
                  orgao_exp: data.conjuge.orgao_exp,
                  nacionalidade: data.conjuge.nacionalidade,
                  naturalidade: data.conjuge.naturalidade,
                  genero: data.conjuge.genero,
                  estado_civil: data.conjuge.estado_civil,
                  formacao: data.conjuge.formacao,
                  profissao: data.conjuge.profissao,
                  renda_liquida: data.conjuge.renda_liquida,
                  telefone: data.conjuge.telefone || "",
                  endereco: data.conjuge.endereco,
                  numero: data.conjuge.numero,
                  bairro: data.conjuge.bairro,
                  cidade: data.conjuge.cidade,
                  estado: data.conjuge.estado,
                  complemento: data.conjuge.complemento,
                  cep: data.conjuge.cep,
                },
                create: {
                  nome: data.conjuge.nome || "",
                  data_nasc: data.conjuge.data_nasc
                    ? new Date(data.conjuge.data_nasc)
                    : undefined,
                  cpf: data.conjuge.cpf,
                  rg: data.conjuge.rg,
                  orgao_exp: data.conjuge.orgao_exp,
                  nacionalidade: data.conjuge.nacionalidade,
                  naturalidade: data.conjuge.naturalidade,
                  genero: data.conjuge.genero,
                  estado_civil: data.conjuge.estado_civil,
                  formacao: data.conjuge.formacao,
                  profissao: data.conjuge.profissao,
                  renda_liquida: data.conjuge.renda_liquida,
                  telefone: data.conjuge.telefone || "",
                  endereco: data.conjuge.endereco,
                  numero: data.conjuge.numero,
                  bairro: data.conjuge.bairro,
                  cidade: data.conjuge.cidade,
                  estado: data.conjuge.estado,
                  complemento: data.conjuge.complemento,
                  cep: data.conjuge.cep,
                  tenantId: tenantId,
                },
              },
            }
          : undefined,
      },
      include: {
        consorciado: true,
        conjuge: true,
      },
    });

    return { success: true, msg: "Fechamento atualizado com sucesso" };
  } catch (error) {
    console.error("Erro ao atualizar fechamento:", error);
    return { success: false, msg: "Erro ao atualizar fechamento" + error };
  }
};

export const createProduction = async (
  currentState: CurrentState,
  data: ProductionSchema
) => {
  try {
    // Se a nova produção for ativa, torne todas as outras inativas
    if (data.isActive) {
      await prisma.producao.updateMany({
        data: { isActive: false },
      });
    }

    // Cria a nova produção (convertendo as datas para Date, se necessário)
    await prisma.producao.create({
      data: {
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive,
      },
    });

    return { success: true, msg: "Produção criada com sucesso" };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Erro ao criar produção: " + error };
  }
};

export const updateProduction = async (
  currentState: CurrentState,
  data: ProductionSchema
) => {
  if (!data.id) {
    return { success: false, msg: "ID não informado para atualização" };
  }
  try {
    // Busca a produção atual no banco
    const currentProduction = await prisma.producao.findUnique({
      where: { id: data.id },
    });

    if (!currentProduction) {
      return { success: false, msg: "Produção não encontrada" };
    }

    // Se a produção atual está ativa e a atualização tenta desativá-la,
    // bloqueia a operação para evitar que o sistema fique sem produção ativa.
    if (currentProduction.isActive && data.isActive === false) {
      return {
        success: false,
        msg: "Não é permitido desativar a produção ativa. Para alterar a produção ativa, ative outra.",
      };
    }

    // Se a atualização define a produção como ativa,
    // torne todas as outras inativas antes de atualizar
    if (data.isActive) {
      await prisma.producao.updateMany({
        data: { isActive: false },
      });
    }

    await prisma.producao.update({
      where: { id: data.id },
      data: {
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive,
      },
    });

    return { success: true, msg: "Produção Atualizada com sucesso" };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Erro ao atualizar produção: " + error };
  }
};

export async function deleteProduction(
  currentState: CurrentState,
  formData: FormData
) {
  const id = Number(formData.get("id"));
  try {
    await prisma.producao.delete({ where: { id } });
    return { success: true, msg: "Produção Deletada com Sucesso" };
  } catch (error) {
    console.error(error);
    return { success: false, msg: "Erro ao deletar produção" };
  }
}

// Cria uma nova equipe
// export const createEquipe = async (
//   currentState: CurrentState,
//   data: EquipeSchema
// ) => {
//   try {
//     const tenantId = await getTenantID();

//     const { name, description, logo, liderId } = data;
//     if (!name || !liderId) {
//       return { success: false, msg: "Nome e líder são obrigatórios" };
//     }
//     // Verifica se o usuário já lidera uma equipe
//     const existingEquipe = await prisma.equipe.findUnique({
//       where: { liderId: liderId },
//     });

//     if (existingEquipe) {
//       return { success: false, msg: "O líder já está em uma equipe" };
//     }
//     await prisma.equipe.create({
//       data: {
//         name,
//         description,
//         logo,
//         liderId,
//         tenantId: tenantId,
//       },
//     });
//     return { success: true };
//   } catch (error) {
//     console.error("Erro ao criar equipe:", error);
//     return { success: false, msg: "Erro ao criar equipe: " + error };
//   }
// };

export const createEquipe = async (
  currentState: CurrentState,
  data: EquipeSchema
) => {
  try {
    const tenantId = await getTenantID();
    const { name, description, logo, liderId } = data;

    if (!name || !liderId) {
      return { success: false, msg: "Nome e líder são obrigatórios" };
    }

    // Verifica se o usuário já lidera uma equipe
    const existingEquipe = await prisma.equipe.findUnique({
      where: { liderId },
    });
    if (existingEquipe) {
      return { success: false, msg: "O líder já está em uma equipe" };
    }

    // Criação inicial da equipe sem logo
    const equipeCriada = await prisma.equipe.create({
      data: {
        name,
        description,
        logo: "", // Será atualizado após salvar o arquivo
        liderId,
        tenantId,
      },
    });

    // Se houver upload de logo
    if (logo) {

      const base64Data = logo.replace(/^data:image\/\w+;base64,/, "");

      // Converte o logo de base64 para Buffer (ajuste se o formato for outro)
      // const bufferLogo = Buffer.from(logo, "base64");
      const bufferLogo = Buffer.from(base64Data, "base64");

      // Define a estrutura do folder de destino utilizando a estrutura informada:
      const folder = `/tenants/${tenantId}/equipes/${equipeCriada.id}`;
      const filename = "logo.png";
      const filePath = path.join(process.cwd(), "public", folder, filename);

      // Garantir que a pasta exista
      await fs.mkdir(path.join(process.cwd(), "public", folder), {
        recursive: true,
      });

      // Salvar o arquivo no caminho definido
      await fs.writeFile(filePath, bufferLogo);

      // Monta o caminho para acesso (URL) - considerando que a pasta "public" é servida estaticamente
      const caminhoLogoUrl = path.posix.join(folder, filename);

      // Atualiza o registro da equipe com o caminho do logo (formato URL)
      await prisma.equipe.update({
        where: { id: equipeCriada.id },
        data: { logo: caminhoLogoUrl },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao criar equipe:", error);
    return { success: false, msg: "Erro ao criar equipe: " + error };
  }
};

// Atualiza uma equipe existente
export const updateEquipe = async (data: EquipeSchema) => {
  try {
    if (!data.id) {
      return { success: false, msg: "ID não informado para atualização" };
    }
    const { id, name, description, logo, liderId } = data;
    if (!name || !liderId) {
      return { success: false, msg: "Nome e líder são obrigatórios" };
    }
    // Verifica se o novo líder já lidera outra equipe
    const equipeComLider = await prisma.equipe.findUnique({
      where: { liderId: liderId },
    });
    if (equipeComLider && equipeComLider.id !== id) {
      return { success: false, msg: "O líder já está em outra equipe" };
    }
    await prisma.equipe.update({
      where: { id },
      data: {
        name,
        description,
        logo,
        liderId,
      },
    });
    return { success: true, msg: "Equipe criada com sucesso" };
  } catch (error) {
    console.error("Erro ao atualizar equipe:", error);
    return { success: false, msg: "Erro ao atualizar equipe" };
  }
};

// Se necessário, deleteEquipe também pode ser ajustado de forma similar:
export const deleteEquipe = async (data: { id: number }) => {
  try {
    await prisma.equipe.delete({
      where: { id: data.id },
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar equipe:", error);
    return { success: false, msg: "Erro ao deletar equipe" };
  }
};

// Move um usuário para uma equipe (ou remove dele se newEquipeId for null)
export const moveUserToEquipe = async (
  userId: number,
  newEquipeId: number | null
) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { equipeId: newEquipeId },
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao mover usuário:", error);
    return {
      success: false,
      msg: "Erro ao mover usuário para a equipe:" + error,
    };
  }
};

// Remove todos os membros (incluindo o líder) e deleta a equipe
export const undoEquipe = async (
  currentState: CurrentState,
  data: { id: number }
) => {
  try {
    // Atualiza os usuários que pertencem a essa equipe: seta equipeId para null
    await prisma.user.updateMany({
      where: { equipeId: data.id },
      data: { equipeId: null },
    });
    // Deleta a equipe
    await prisma.equipe.delete({
      where: { id: data.id },
    });
    return { success: true, msg: "Equipe desfeita com sucesso" };
  } catch (error) {
    console.error("Erro ao desfazer equipe:", error);
    return { success: false, msg: "Erro ao desfazer equipe: " + error };
  }
};

interface ConsorcioInput {
  titulo: string;
  empresa: string;
  credito: string; // em formato numérico (string) que será convertido para Decimal
  adesao: string;
  entrada: string;
  parcelaCheia: string;
  parcelaReduzida: string;
  lance: string;
  prazo: number;
  creditoPosContemplacao: string;
  rendaExigida: string;
  valorPago: string;
  jurosPagos: string;
  parcelasEmbutidas: number;
}

interface FinanciamentoInput {
  titulo: string;
  amortizacao: string;
  banco: string;
  juros: string; // taxa de juros (% anual, por exemplo)
  credito: string;
  entrada: string;
  parcelas: string;
  ultimaParcela: string;
  prazo: number;
  rendaExigida: string;
  cartorio: string;
  jurosPagos: string;
  valorPagoTotal: string;
}

interface SimulacaoInput {
  tipo: string | null;
  negocioId: number;
  userId: number;
  consorcios: ConsorcioInput[];
  financiamentos: FinanciamentoInput[];
}

/**
 * Salva a simulação com os registros de consórcio e financiamento.
 * - dataProposta é definida como a data de hoje.
 * - Os valores monetários são convertidos para Decimal.
 *
 * @param dados - Dados da simulação.
 * @returns A simulação criada, com as relações (consorcios e financiamentos) incluídas.
 */
export async function salvarSimulacao(dados: SimulacaoInput) {
  try {
    const tenantId = await getTenantID();

    const simulacao = await prisma.simulacao.create({
      data: {
        tipo: dados.tipo,
        dataProposta: new Date(),
        negocioId: dados.negocioId,
        userId: dados.userId,
        tenantId: tenantId,
        consorcios: {
          create: dados.consorcios.map((c) => ({
            conTitulo: c.titulo,
            conEmpresa: c.empresa,
            conCredito: new Decimal(c.credito || "0"),
            conAdesao: new Decimal(c.adesao || "0"),
            conEntrada: new Decimal(c.entrada || "0"),
            conParcelaCheia: new Decimal(c.parcelaCheia || "0"),
            conParcelaReduzida: new Decimal(c.parcelaReduzida || "0"),
            conLance: new Decimal(c.lance || "0"),
            conPrazo: c.prazo,
            conCreditoPosContemplacao: new Decimal(
              c.creditoPosContemplacao || "0"
            ),
            conRendaExigida: new Decimal(c.rendaExigida || "0"),
            conValorPago: new Decimal(c.valorPago || "0"),
            conJurosPagos: new Decimal(c.jurosPagos || "0"),
            conParcelasEmbutidas: c.parcelasEmbutidas || 0,
          })),
        },
        financiamentos: {
          create: dados.financiamentos.map((f) => ({
            finTitulo: f.titulo,
            finAmortizacao: f.amortizacao,
            finEmpresa: f.banco,
            finCredito: new Decimal(f.credito || "0"),
            finEntrada: new Decimal(f.entrada || "0"),
            finParcelas: new Decimal(f.parcelas || "0"),
            finUltimaParcela: new Decimal(f.ultimaParcela || "0"),
            finPrazo: f.prazo,
            finRendaExigida: new Decimal(f.rendaExigida || "0"),
            finCartorio: new Decimal(f.cartorio || "0"),
            finJurosPagos: new Decimal(f.jurosPagos || "0"),
            finValPagoTotal: new Decimal(f.valorPagoTotal || "0"),
          })),
        },
      },
      include: {
        consorcios: true,
        financiamentos: true,
      },
    });

    return { success: true, simulacaoId: simulacao.id };
  } catch (error: any) {
    console.error("Erro ao salvar simulação:", error);
    return { success: false, msg: error.message };
  }
}

interface SearchParamsDate {
  data_inicio?: string;
  data_fim?: string;
}

export async function getProducaoDates(
  searchParams: SearchParamsDate
): Promise<{
  fromDate: Date;
  toDate: Date;
}> {
  let fromDate: Date, toDate: Date;

  if (!searchParams?.data_inicio || !searchParams?.data_fim) {
    const activeProduction = await prisma.producao.findFirst({
      where: { isActive: true },
    });
    if (!activeProduction) {
      throw new Error("Não há produção ativa para usar como intervalo.");
    }
    fromDate = activeProduction.startDate;
    toDate = activeProduction.endDate;
  } else {
    fromDate = parseDateUsa(searchParams.data_inicio);
    toDate = parseDateUsa(searchParams.data_fim);
  }

  return { fromDate, toDate };
}

export async function salvarAprovacao({
  negocioId,
  status,
}: {
  negocioId: number;
  status: string;
}) {
  try {
    const tenantId = await getTenantID();

    const data_aprovacao = new Date();
    const aprovacao = await prisma.aprovacao.create({
      data: {
        data_aprovacao,
        status,
        negocio: { connect: { id: negocioId } },
        tenant: { connect: { id: tenantId } },
      },
    });

    return { success: true, msg: "Aprovação Salva" };
  } catch (error: any) {
    console.error("Erro ao salvar aprovação:", error);
    return { success: false, msg: error.message };
  }
}

export async function getTimeComercialVendedores() {
  const tenantId = await getTenantID();
  return prisma.user.findMany({
    where: {
      status: 1,
      roles: {
        some: {
          name: "time_comercial",
        },
      },
      tenantId: tenantId,
    },
    select: { id: true, name: true },
  });
}

import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { basePrisma, getTenantID, prisma } from "./prisma";
import dayjs from "./dayjs";
import { connect } from "http2";

export async function saveImageLocally(
  croppedImage: string,
  providedFilename?: string,
  providedFolder?: string
): Promise<{ fileUrl: string }> {
  // Verifica se a imagem está no formato Data URL (ex.: data:image/png;base64,...)
  const matches = croppedImage.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length < 3) {
    throw new Error("Formato inválido de imagem");
  }
  const mime = matches[1]; // exemplo: image/png
  const base64Data = matches[2];
  const ext = mime.split("/")[1];
  const buffer = Buffer.from(base64Data, "base64");

  // Converte o buffer para PNG garantindo a transparência
  // Força saída em PNG mantendo a transparência
  const pngBuffer = await sharp(buffer)
    .ensureAlpha() // Garante canal alfa
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      force: true,
    })
    .toBuffer();

  // Gera um nome único e define o caminho para salvar a imagem (ex.: public/uploads)
  const filename = providedFilename
    ? `${providedFilename}.png`
    : `img_${Date.now()}.png`;

  // Se "providedFolder" existir, usamos ele; senão, padrão "uploads"
  const folder = providedFolder ? providedFolder : "uploads";
  const filePath = path.join(process.cwd(), "public", folder, filename);

  // Salva a imagem na pasta public/uploads
  await fs.writeFile(filePath, pngBuffer);

  // Retorna a URL pública
  return { fileUrl: `/${folder}/${filename}` };
}

type CurrentStateUpload = { success: boolean; msg: string; fileUrl: string };

export async function saveLocalCroppedImageAction(options?: {
  id?: string;
  database?: string;
  field?: string;
  value: string;
  filename?: string;
  folder?: string;
  configType?: "avatar" | "system_image" | "config_value"; // Tipo de configuração
}): Promise<CurrentStateUpload & { fileUrl?: string }> {
  try {
    let storedValue: string = options?.value ?? "";

    const tenantId = await getTenantID();

    if (options?.folder) {
      await fs.mkdir(path.join(process.cwd(), "public", options.folder), {
        recursive: true,
      });
    }

    // Determina se deve processar como imagem com base no configType
    const isImage =
      options?.configType === "avatar" ||
      options?.configType === "system_image";

    // Se for imagem (avatar ou system_image), salva localmente primeiro
    if (isImage) {
      const { fileUrl } = await saveImageLocally(
        storedValue, // Contém o data URL da imagem
        options?.filename,
        options?.folder ||
          (options?.configType === "avatar" ? "avatars" : "system")
      );
      storedValue = fileUrl; // URL do arquivo para armazenar
    }

    // Determina onde salvar com base no configType
    if (
      options?.configType === "system_image" ||
      options?.configType === "config_value"
    ) {
      // CASO 1: Salvar na tabela Config (para imagens do sistema ou valores de configuração)
      const key = options.field || options.filename;
      if (!key) {
        throw new Error(
          "É necessário fornecer field ou filename como key para configurações"
        );
      }

      // Verifica se já existe uma configuração com esta chave
      const existingConfig = await prisma.config.findUnique({
        where: { tenantId_key: { tenantId, key } },
      });

      if (existingConfig) {
        // Atualiza a configuração existente
        await prisma.config.update({
          where: { tenantId_key: { tenantId, key } },
          data: {
            value: storedValue,
            updatedAt: new Date(),
          },
        });
      } else {
        // Cria nova configuração
        await prisma.config.create({
          data: {
            key,
            value: storedValue,
            description: isImage ? `Imagem: ${key}` : `Configuração: ${key}`,
            tenant: { connect: { id: tenantId } },
          },
        });
      }
    }
    // CASO 2: Atualizar avatar de usuário
    else if (options?.configType === "avatar" && options?.id) {
      if (options?.database === "user") {
        await prisma.user.update({
          where: { id: Number(options.id) },
          data: { avatar: storedValue },
        });
      } else if (options?.database === "leads") {
        await prisma.lead.update({
          where: { id: Number(options.id) },
          data: { avatar: storedValue },
        });
      } else if (options?.database === "equipe") {
        await prisma.equipe.update({
          where: { id: Number(options.id) },
          data: { logo: storedValue },
        });
      } else {
        throw new Error(
          `Database ${options?.database} não reconhecido para salvar o avatar`
        );
      }
    } else {
      throw new Error("Parâmetros inválidos ou configType não reconhecido");
    }

    return {
      success: true,
      msg: "Operação realizada com sucesso",
      fileUrl: storedValue,
    };
  } catch (error: any) {
    console.error("Erro em saveLocalCroppedImageAction:", error);
    return {
      success: false,
      msg: error.message || "Erro ao salvar",
    };
  }
}

function getConfigDictionary<T extends { key: string; value: string }>(
  configs: T[],
  keys: string[]
): Record<string, string> {
  return keys.reduce(
    (dict, key) => {
      const config = configs.find((c) => c.key === key);
      dict[key] = config ? config.value : "";
      return dict;
    },
    {} as Record<string, string>
  );
}

export async function getConfigurations(keysToFind: string[]) {
  const configs = await prisma.config.findMany({
    where: {
      key: { in: keysToFind },
    },
  });

  const configDict = getConfigDictionary(configs, keysToFind);
  return configDict;
}

interface UpdateConfigParams {
  key: string;
  value: boolean;
}

export async function updateBooleanConfigAction({
  key,
  value,
}: UpdateConfigParams) {
  // Exemplo: se for do model "Config", atualiza pelo campo "key"
  const tenantId = await getTenantID();

  await prisma.config.upsert({
    where: {
      // Aqui, o nome do campo composto gerado automaticamente é "tenantId_key"
      // Isso depende da nomenclatura do Prisma, mas geralmente é o nome dos campos concatenados com um underline.
      tenantId_key: { tenantId, key },
    },
    update: { value: value ? "true" : "false" },
    create: { tenantId, key, value: value ? "true" : "false" },
  });

  // Caso haja outros models, adicione as condições necessárias.
}

export async function getOrCreateFechamento(negocioId: number) {
  const tenantId = await getTenantID();

  // Tenta buscar o fechamento associado ao negócio, com os relacionamentos
  let fechamento = await prisma.fechamento.findFirst({
    where: { negocioId },
    include: {
      negocio: {
        include: {
          consorciado: true,
          conjuge: true,
        },
      },
      vendedores: {
        include: { user: true },
      },
    },
  });

  // Se não existir, busca o negócio e cria um fechamento com status "RASCUNHO"
  if (!fechamento) {
    const negocio = await prisma.negocio.findUnique({
      where: { id: negocioId },
    });
    if (!negocio) {
      throw new Error("Negócio não encontrado");
    }

    fechamento = await prisma.fechamento.create({
      data: {
        negocio: { connect: { id: negocio.id } },
        status: "RASCUNHO",
        tenant: { connect: { id: tenantId } },
      },
      include: {
        negocio: {
          include: {
            consorciado: true,
            conjuge: true,
          },
        },
        vendedores: {
          include: { user: true },
        },
      },
    });
  }

  return fechamento;
}

export type Lead = {
  nome: string;
  telefone: string;
  email: string;
  tipo: NegocioTipo;
  campanha: string;
  fonte: string;
  data_conversao: string;
};

export async function importLeadsAction(leads: Lead[], userId: number) {
  let imported = 0;
  let rejected = 0;

  const tenantId = await getTenantID();

  for (const lead of leads) {
    try {
      // Verifica se já existe um lead importado com o mesmo telefone
      const exists = await prisma.leadImportado.findUnique({
        where: { telefone: lead.telefone },
      });

      if (exists) {
        rejected++;
        continue;
      }

      // Cria o registro no modelo NegocioImportado
      await prisma.leadImportado.create({
        data: {
          userId: userId,
          nome: lead.nome,
          telefone: lead.telefone,
          email: lead.email || null,
          campanha: lead.campanha || null,
          fonte: lead.fonte || null,
          data_conversao: dayjs().toDate(),
          origem: "IMPORTACAO_PLANILHA",
          tenantId: tenantId,
          tipo: lead.tipo,
        },
      });

      imported++;
    } catch (error) {
      console.error("Erro ao importar lead:", lead, error);
      rejected++;
    }
  }

  console.log("Leads recebidos:", leads);
  return { imported, rejected };
}

// Server action que deleta os registros conforme o modelo
export async function deleteItemsAction(
  formData: FormData,
  model: "negocio" | "leadImportado" | "upload"
) {
  try {
    const ids = JSON.parse(formData.get("ids") as string) as number[];

    if ((prisma as any)[model]) {
      if (model === "upload") {
        await Promise.all(
          ids.map(async (id) => {
            const upload = await basePrisma.upload.findUnique({
              where: { id },
            });
            if (!upload) {
              throw new Error("Arquivo não encontrado");
            }
            // Remove o arquivo do disco (se existir)
            const filePath = path.join(
              process.cwd(),
              "public",
              upload.filePath
            );
            try {
              await fs.unlink(filePath);

              await prisma.upload.delete({ where: { id } });
            } catch (error) {
              console.error("Erro ao deletar arquivo do disco", error);
            }
          })
        );
      } else {
        await (prisma as any)[model].deleteMany({
          where: { id: { in: ids } },
        });
      }
    } else {
      throw new Error(`Model ${model} não existe no Prisma.`);
    }
    return { success: true, msg: "Registros deletados com sucesso" };
  } catch (error) {
    console.log("Erro ao deletar negocio:", error);
    return { success: false, msg: "Erro ao deletar negocio: " + error };
  }
}

interface CreateComentarioParams {
  negocioId: number;
  userId: number; // se quiser vincular a um usuário logado
  comentario: string;
}

/**
 * Cria um novo comentário para o negócio informado.
 */
export async function createNegocioComentarioAction({
  negocioId,
  userId,
  comentario,
}: CreateComentarioParams) {
  if (!negocioId || !comentario) {
    throw new Error("Dados insuficientes para criar comentário.");
  }

  try {
    const novoComentario = await prisma.negocioComentario.create({
      data: {
        negocioId,
        userId, // se existir
        comentario,
      },
    });

    return { success: true, msg: "Comentário adicionado com sucesso" };
  } catch (error) {
    console.log("Erro ao deletar negocio:", error);
    return { success: false, msg: "Erro ao deletar negocio: " + error };
  }
}
