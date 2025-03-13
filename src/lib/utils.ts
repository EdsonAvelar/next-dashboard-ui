import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // ajuste o caminho conforme sua estrutura

/**
 * Obtém o usuário atual autenticado a partir da sessão do servidor.
 *
 * Esta função utiliza a função `getServerSession` passando as configurações de autenticação
 * definidas em `authOptions` para recuperar a sessão atual. Em seguida, extrai as informações
 * do usuário (nome, cargo e avatar) da sessão. Caso alguma dessas informações não esteja disponível,
 * são utilizados valores padrão:
 *
 * - name: "Guest" (caso o nome não esteja definido)
 * - cargo: "Sem Cargo" (caso o cargo não esteja definido)
 * - avatar: "/noAvatar" (caso o avatar não esteja definido)
 *
 * @returns Um objeto contendo:
 *  - name: O nome do usuário ou "Guest" se não autenticado.
 *  - cargo: O cargo do usuário ou "Sem Cargo" se não definido.
 *  - avatar: A URL do avatar do usuário ou o caminho para a imagem padrão.
 */

export const NegocioTipoOptions = [
  { value: "IMOVEL", label: "Imóvel" },
  { value: "CARRO", label: "Carro" },
  { value: "MOTO", label: "Moto" },
  { value: "CAMINHAO", label: "Caminhão" },
  { value: "TERRENO", label: "Terreno" },
  { value: "MAQUINARIO", label: "Maquinário" },
  { value: "SERVICO", label: "Serviço" },
];


export const NegotioStatus = {
  ATIVO: "ATIVO",
  INATIVO: "INATIVO",
  VENDIDO: "VENDIDO",
  PERDIDO: "PERDIDO",
};

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
