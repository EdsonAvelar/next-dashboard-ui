"use server";

import { NegocioTipo } from "@prisma/client";
import {
  FechamentoSchema,
  FuncionarioSchema,
  NegocioSchema,
} from "./formValidationSchema";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

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
      },
    });

    console.log(data);

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

    console.log("update user");
    console.log(data);

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

    console.log("Agendametno criado com suceso 123");

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
    return { success: false };
  }
}

export const updateFechamento = async (
  data: FechamentoSchema
): Promise<CurrentState> => {
  try {
    const fechamento = await prisma.fechamento.update({
      where: { negocioId: parseInt(data.negocio_id, 10) },
      data: {
        data_fechamento: data.data_fechamento
          ? new Date(data.data_fechamento)
          : null,
        status: data.status || null,
        especie: data.especie || null,
        marca: data.marca || null,
        modelo: data.modelo || null,
        codigo_bem: data.codigo_bem || null,
        preco_bem: data.preco_bem ? parseFloat(data.preco_bem) : null,
        duracao_grupo: data.duracao_grupo
          ? parseInt(data.duracao_grupo, 10)
          : null,
        duracao_plano: data.duracao_plano
          ? parseInt(data.duracao_plano, 10)
          : null,
        grupo_em_formacao: data.grupo_em_formacao === "1",
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
        comentarios: data.comentarios || null,
        vendedores: {
          deleteMany: {}, // Remove todas as associações atuais
          create:
            data.vendedores && data.vendedores.length > 0
              ? data.vendedores
                  .filter((v) => v.userId !== "") // Garante que só serão criados registros com usuário selecionado
                  .map((v) => ({
                    userId: parseInt(v.userId, 10),
                    comissao: v.comissao ? v.comissao : null,
                    modo: v.modo || null,
                  }))
              : [],
        },
      },
    });
    console.log(fechamento);
    console.log(fechamento);
    return { success: true, msg: "Fechamento atualizado com sucesso" };
  } catch (error) {
    console.error("Erro ao atualizar fechamento:", error);
    return { success: false, msg: "Erro ao atualizar fechamento" };
  }
};
