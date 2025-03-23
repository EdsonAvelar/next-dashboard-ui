export const NegocioTipoOptions = [
  { value: "IMOVEL", label: "Imóvel" },
  { value: "CARRO", label: "Carro" },
  { value: "MOTO", label: "Moto" },
  { value: "CAMINHAO", label: "Caminhão" },
  { value: "TERRENO", label: "Terreno" },
  { value: "MAQUINARIO", label: "Maquinário" },
  { value: "SERVICO", label: "Serviço" },
];

export const NegocioTipo = {
  IMOVEL: "IMOVEL",
  CARRO: "CARRO",
  MOTO: "MOTO",
  CAMINHAO: "CAMINHAO",
  TERRENO: "TERRENO",
  MAQUINARIO: "MAQUINARIO",
  SERVICO: "SERVICO",
};

export const UserStatus = {
  ATIVO: 1,
  INATIVO: 0,
};

export const AprovacaoStatus = {
  ANALISE: "ANALISE",
  APROVADO: "APROVADO",
  REPROVADO: "REPROVADO",
};

export const NegotioStatus = {
  ATIVO: "ATIVO",
  INATIVO: "INATIVO",
  VENDIDO: "VENDIDO",
  PERDIDO: "PERDIDO",
};

export const FechamentoStatus = {
  FECHADA: "FECHADA",
  CANCELADA: "CANCELADA",
  RASCUNHO: "RASCUNHO",
};

export const ModoFechamentoOptions = [
  { value: "VENDEDOR_PRINCIPAL", label: "Vendedor Principal" },
  { value: "MODO_AJUDA", label: "Modo Ajuda" },
  { value: "TELEMARKETING", label: "Telemarketing" },
  { value: "OUTROS", label: "Outros" },
];

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export function parseDateBr(value: string): Date {
  // Recebe algo como "20/09/2023" e retorna um objeto Date
  const [dia, mes, ano] = value.split("/");
  return new Date(+ano, +mes - 1, +dia);
}

export function parseDateUsa(value: string): Date {
  // Recebe uma string como "2023-09-20" e retorna um objeto Date
  const [year, month, day] = value.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

// Função auxiliar para formatar valores em reais
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
};
/**
 * Trunca um número para a quantidade de casas decimais especificada.
 * Ex.: truncate(2.568, 2) retorna 2.56.
 */
export function truncate(num: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.floor(num * factor) / factor;
}

/**
 * Formata um número para um formato curto:
 * - Se o número for menor que 1.000, retorna o número como string.
 * - Se estiver entre 1.000 e 999.999, converte para "K" (milhares).
 *   Ex.: 1200 -> "1.2K", 120000 -> "120K", 120500 -> "120.50K"
 * - Se for 1.000.000 ou maior, converte para "M" (milhões).
 *   Ex.: 2568000 -> "2.56M"
 */
export function formatNumberShort(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1e6) {
    const value = num / 1000;
    return value < 10 ? `${value.toFixed(1)}K` : `${value.toFixed(2)}K`;
  } else {
    const value = num / 1e6;
    return `${value.toFixed(2)}M`;
  }
}

export function toPath(...parts: string[]): string {
  // Remove as barras iniciais e finais de cada parte e filtra strings vazias
  const trimmed = parts.map((p) => p.replace(/^\/+|\/+$/g, "")).filter(Boolean);
  return "/" + trimmed.join("/");
}
