"use server";

import { NegocioTipo } from "@prisma/client";
import { FuncionarioSchema, NegocioSchema } from "./formValidationSchema";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

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

    const negocio = await prisma.negocio.create({
      data: {
        titulo:
          data.titulo ||
          `Negócio ${data.nome_contato.split(" ")[0]} - ${data.tipo_credito}${data.valor_credito ? " - " + data.valor_credito : ""}`,
        // Os campos "tipo" e "status" devem ser definidos conforme seu enum
        tipo: data.tipo_credito as NegocioTipo,
        status: "ATIVO", // ou outro valor padrão, conforme seu enum NegocioStatus
        // Conectando o Lead criado:
        lead: { connect: { id: lead.id } },
        // Conectando outros relacionamentos, utilizando os IDs recebidos ou definidos no form:
        funil: { connect: { id: 1 } },
        etapa_funil: { connect: { id: 1 } },
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
        lead: { connect: { id: lead.id } },
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

export const createFuncionario = async (
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

export const updateFuncionario = async (
  currentState: CurrentState,
  data: FuncionarioSchema
) => {
  try {
    const passwordHash = await bcrypt.hash(data.password, 10);

    console.log(data);

    const newFuncionario = await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        email: data.email,
        password: passwordHash, // Em produção, lembre-se de hashear a senha!
        avatar: "/noAvatar.png",
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
