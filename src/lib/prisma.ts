// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Em ambiente de desenvolvimento, reutilizamos a instância do Prisma
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const basePrisma = global.__prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.__prisma = basePrisma;

// Função para obter o tenant a partir da sessão do NextAuth
/**
 * Retrieves the tenant ID from the current user's session.
 *
 * This asynchronous function obtains the server session using getServerSession with authOptions,
 * accesses the tenant ID stored in the session's user object, and returns it as a number.
 * If the tenant ID is not found, the function throws an error.
 *
 * @returns {Promise<number>} A promise that resolves to the tenant ID parsed as a number.
 * @throws {Error} If the tenant ID is not found in the session.
 */
export async function getTenantID(): Promise<number> {
  const session = await getServerSession(authOptions);
  // Considere que na sessão o campo esteja armazenado como "tentantId"
  const tenantId = session?.user?.tenantId;
  if (!tenantId) {
    throw new Error("Tenant ID não encontrado na sessão");
  }
  return parseInt(tenantId.toString(), 10);
}

// Cria a instância estendida que injeta automaticamente o filtro do tenant
export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async findMany({ args, query }) {
        const tenantId = await getTenantID();
        args.where = args.where
          ? { ...args.where, tenantId: tenantId }
          : { tenantId: tenantId };
        return query(args);
      },
      async findFirst({ args, query }) {
        const tenantId = await getTenantID();
        args.where = args.where
          ? { ...args.where, tenantId: tenantId }
          : { tenantId: tenantId };
        return query(args);
      },
      async findUnique({ args, query }) {
        const tenantId = await getTenantID();
        args.where = args.where
          ? { ...args.where, tenantId: tenantId }
          : { tenantId: tenantId };
        return query(args);
      },
      async count({ args, query }) {
        const tenantId = await getTenantID();
        args.where = args.where
          ? { ...args.where, tenantId: tenantId }
          : { tenantId: tenantId };
        return query(args);
      },

      // async create({ args, query }) {
      //     const tenantId = await getTenantID();
      //     args.data = {
      //         ...args.data,
      //         tenantId: tenantId,
      //     };
      //     return query(args);
      // },
      // Você pode estender outros métodos (findUnique, update, delete, etc.) de forma semelhante.
    },
  },
});
