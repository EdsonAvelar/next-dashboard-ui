import { z } from "zod";

// Defina seu schema (exemplo)
export const funcionarioSchema = z.object({
  id: z.coerce.number().optional(),
  name: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long!" })
    .max(20, { message: "Username max size is 20!" }),
  email: z.string().email({ message: "Invalida email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  // phone: z.string().min(1, { message: "Phone name is required" }),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  cpf: z.string().optional(),
  data_contratacao: z.string().optional(),
  // birthday: z.date({ message: "Birthday name is required" }),
  // img: z.string().min(1, { message: "Image is required" }),
  cargo: z.string().min(1, { message: "Cargo is required" }),
});

export type FuncionarioSchema = z.infer<typeof funcionarioSchema>;

// Schema de validação com Zod
export const negocioSchema = z.object({
  id: z.coerce.number().optional(),
  // Campos obrigatórios:
  nome_contato: z.string().min(1, { message: "Nome do contato é obrigatório" }),
  telefone: z.string().min(1, { message: "Telefone é obrigatório" }),
  tipo_credito: z.string().min(1, { message: "Tipo de crédito é obrigatório" }),
  // Campos opcionais:
  valor_credito: z.string().optional(),
  titulo: z.string().optional(),
  whatsapp: z.string().optional(),
  proprietario_id: z.string().optional(),
});

export type NegocioSchema = z.infer<typeof negocioSchema>;

export const leadSchema = z.object({
  nome: z.string().optional(),
  email: z.string().optional(),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  data_nasc: z.string().optional(),
  nome_mae: z.string().optional(),
  nome_pai: z.string().optional(),
  orgao_exp: z.string().optional(),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  data_exp: z.string().optional(),
  nacionalidade: z.string().optional(),
  naturalidade: z.string().optional(),
  genero: z.string().optional(),
  estado_civil: z.string().optional(),
  formacao: z.string().optional(),
  profissao: z.string().optional(),
  renda_liquida: z.string().optional(),
  data_conversao: z.string().optional(),
  fonte: z.string().optional(),
  campanha: z.string().optional(),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  complemento: z.string().optional(),
  cep: z.string().optional(),
});

export const vendedorSchema = z.object({
  userId: z.string(),
  modo: z.string(),
  comissao: z.string().optional(),
});

export const fechamentoSchema = z.object({
  negocio_id: z.string(),
  data_fechamento: z.string().optional(),
  status: z.string().optional(),
  grupo: z.string().optional(),
  cota: z.string().optional(),
  especie: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  tipo_plano: z.string().optional(),
  plano_leve: z.string().optional(),
  seguro_prestamista: z.string().optional(),
  codigo_bem: z.string().optional(),
  preco_bem: z.string().optional(),
  duracao_grupo: z.string().optional(),
  duracao_plano: z.string().optional(),
  grupo_em_formacao: z.string().optional(),
  numero_assembleia_adesao: z.string().optional(),
  data_assembleia: z.string().optional(),
  pagamento_incorporado: z.string().optional(),
  pagamento_ate_contemplacao: z.string().optional(),
  numero_contrato: z.string().optional(),
  parcela: z.string().optional(),
  parcela_antecipada: z.string().optional(),
  total_antecipado: z.string().optional(),
  adesao: z.string().optional(),
  primeira_parcela: z.string().optional(),
  total_pago: z.string().optional(),
  forma_pagamento: z.string().optional(),
  comentarios: z.string().optional(),
  tabela: z.string().optional(),
  vendedores: z.array(vendedorSchema).optional(),
  consorciado: leadSchema.optional(),
  conjuge: leadSchema.optional(),
});

export type FechamentoSchema = z.infer<typeof fechamentoSchema>;

export const productionSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, "O nome é obrigatório"),
  startDate: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  endDate: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  isActive: z.boolean().default(true),
});

export type ProductionSchema = z.infer<typeof productionSchema>;

export const equipeSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, "O nome da equipe é obrigatório"),
  description: z.string().optional(),
  // Recebemos o liderId como string e depois transformamos para number
  liderId: z
    .string()
    .min(1, "O ID do líder é obrigatório")
    .transform((val) => parseInt(val, 10)),
  logo: z.string().optional(),
});

export type EquipeSchema = z.infer<typeof equipeSchema>;
