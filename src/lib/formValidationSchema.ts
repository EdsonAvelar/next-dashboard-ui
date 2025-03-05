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
  // address: z.string().min(1, { message: "Address name is required" }),
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
});

export type NegocioSchema = z.infer<typeof negocioSchema>;
