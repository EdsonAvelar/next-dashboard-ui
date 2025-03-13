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


export const vendedorSchema = z.object({
  userId: z.string().min(1, "Selecione um usuário"),
  modo: z.string().min(1, "Selecione um papel").optional(),
  comissao: z.string().optional(), // vamos converter para Decimal depois
  confirmed: z.boolean().optional(),
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
  // Aqui definimos o array de vendedores:
  vendedores: z.array(vendedorSchema).optional(),
});

export type FechamentoSchema = z.infer<typeof fechamentoSchema>;
