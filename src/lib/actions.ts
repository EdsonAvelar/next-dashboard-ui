"use server";

import { NegocioTipo } from "@prisma/client";
import {
  EquipeSchema,
  FechamentoSchema,
  FuncionarioSchema,
  NegocioSchema,
  ProductionSchema,
} from "./formValidationSchema";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { Decimal } from "@prisma/client/runtime/library";
import { redirect } from "next/navigation";
import { formatNumberShort, parseDateBr, parseDateUsa } from "./utils";

type CurrentState = { success: boolean; msg: string };

export const createNegocio = async (
  currentState: CurrentState,
  data: NegocioSchema
) => {
  try {
    const lead = await prisma.lead.create({
      data: {
        nome: data.nome_contato,
        telefone: data.telefone,
        whatsapp: data.whatsapp || "",
        email: data.email || ""
      },
    });

    // Se existir o parâmetro proprietario_id, prepara a conexão com o usuário
    const userConnection = data.proprietario_id
      ? { user: { connect: { id: parseInt(data.proprietario_id, 10) } } }
      : {};

    const negocio = await prisma.negocio.create({
      data: {
        titulo:
          data.titulo ||
          `Negócio ${data.nome_contato.split(" ")[0]} - ${data.tipo_credito}${data.valor_credito ? " - " + data.valor_credito : ""}`,
        // Os campos "tipo" e "status" devem ser definidos conforme seu enum
        tipo: data.tipo_credito as NegocioTipo,
        status: "ATIVO", // ou outro valor padrão, conforme seu enum NegocioStatus
        // Conectando o Lead criado:
        consorciado: { connect: { id: lead.id } },
        // Conectando outros relacionamentos, utilizando os IDs recebidos ou definidos no form:
        funil: { connect: { id: 1 } },
        etapa_funil: { connect: { id: 1 } },
        ...userConnection,
      },
    });
    // revalidatePath("/negocios/lista");

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
    const lead = await prisma.lead.create({
      data: {
        nome: data.nome_contato,
        telefone: data.telefone,
      },
    });

    const negocio = await prisma.negocio.update({
      where: {
        id: data.id,
      },
      data: {
        titulo:
          data.titulo ||
          `Negócio ${data.nome_contato.split(" ")[0]} - ${data.tipo_credito}${data.valor_credito ? " - " + data.valor_credito : ""}`,
        // Os campos "tipo" e "status" devem ser definidos conforme seu enum
        tipo: data.tipo_credito as NegocioTipo,
        status: "ATIVO", // ou outro valor padrão, conforme seu enum NegocioStatus
        // Conectando o Lead criado:
        consorciado: { connect: { id: lead.id } },
        // Conectando outros relacionamentos, utilizando os IDs recebidos ou definidos no form:
        funil: { connect: { id: 1 } },
        etapa_funil: { connect: { id: 1 } },
      },
    });
    // revalidatePath("/negocios/lista");

    return { success: true, msg: "" };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Erro ao Atualizar Negocio" };
  }
};

// Tipo para os registros importados em massa
type MassNegocioData = {
  tipo_credito: string;
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
    // Para cada registro, cria o Lead e o Negócio correspondente
    for (const registro of data.registros) {
      // Criação do lead
      const lead = await prisma.lead.create({
        data: {
          nome: registro.name,
          telefone: registro.telefone,
        },
      });

      console.log(registro);

      // Se existir o parâmetro proprietario_id, prepara a conexão com o usuário
      const userConnection = data.proprietario_id
        ? { user: { connect: { id: parseInt(data.proprietario_id, 10) } } }
        : {};

      // Cria um título padrão, combinando o primeiro nome com o tipo de crédito
      const titulo =
        `${registro.name.split(" ")[0]} - ${data.tipo_credito}` +
        (registro.credito ? ` - ${formatNumberShort(registro.credito)}` : "");

      // Criação do negócio
      await prisma.negocio.create({
        data: {
          titulo,
          // Define o tipo conforme o enum; ajuste se necessário
          tipo: data.tipo_credito as NegocioTipo,
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
    // Recebe os campos do formulário
    const negocioIdsStr = formData.get("negocioIds") as string; // JSON com array de números
    const proprietarioIdStr = formData.get("proprietarioId") as string;
    const etapaIdStr = formData.get("etapaId") as string;

    // Converte os valores
    const negocioIds: number[] = JSON.parse(negocioIdsStr);
    const proprietarioId = proprietarioIdStr
      ? parseInt(proprietarioIdStr, 10)
      : null;
    const etapaId = etapaIdStr ? parseInt(etapaIdStr, 10) : null;

    // Atualiza cada negócio (supondo que o relacionamento seja many-to-one com User e many-to-one com EtapaFunil)
    await Promise.all(
      negocioIds.map((id) =>
        prisma.negocio.update({
          where: { id },
          data: {
            // Atualiza o proprietário: se não selecionado, desconecta
            user: proprietarioId
              ? { connect: { id: proprietarioId } }
              : { disconnect: true },
            // Atualiza a etapa do funil, se selecionada (se não, não altera ou pode desconectar)
            etapa_funil: etapaId ? { connect: { id: etapaId } } : undefined,
          },
        })
      )
    );

    return { success: true, msg: "Negócios atribuídos com sucesso!" };
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
    return { success: false, msg: "Erro ao atualizar fechamento" };
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
export const createEquipe = async (
  currentState: CurrentState,
  data: EquipeSchema
) => {
  try {
    const { name, description, logo, liderId } = data;
    if (!name || !liderId) {
      return { success: false, msg: "Nome e líder são obrigatórios" };
    }
    // Verifica se o usuário já lidera uma equipe
    const existingEquipe = await prisma.equipe.findUnique({
      where: { liderId: liderId },
    });
    if (existingEquipe) {
      return { success: false, msg: "O líder já está em uma equipe" };
    }
    await prisma.equipe.create({
      data: {
        name,
        description,
        logo,
        liderId,
      },
    });
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
    const simulacao = await prisma.simulacao.create({
      data: {
        tipo: dados.tipo,
        dataProposta: new Date(),
        negocioId: dados.negocioId,
        userId: dados.userId,
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
    const data_aprovacao = new Date();
    const aprovacao = await prisma.aprovacao.create({
      data: {
        data_aprovacao,
        status,
        negocio: { connect: { id: negocioId } },
      },
    });

    return { success: true, msg: "Aprovação Salva" };
  } catch (error: any) {
    console.error("Erro ao salvar aprovação:", error);
    return { success: false, msg: error.message };
  }
}

export async function getTimeComercialVendedores() {
  return prisma.user.findMany({
    where: {
      status: 1,
      roles: {
        some: {
          name: "time_comercial",
        },
      },
    },
    select: { id: true, name: true },
  });
}
