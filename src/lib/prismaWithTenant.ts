// import { PrismaClient } from "@prisma/client";
// import { prisma } from "./prisma.ts";
// import { getTentantID } from "./actions";

// export async function prismaWithTenant() {
//   const tenantId = await getTentantID();

//   if (!tenantId) {
//     throw new Error(
//       "Tenant ID not found. Please set the tenant ID in your environment."
//     );
//   }

//   return prisma.$extends({
//     query: {
//       $allModels: {
//         findMany({ args, query }) {
//           // Se já houver um filtro, mescla com tenantId; caso contrário, cria-o.
//           args.where = args.where ? { ...args.where, tenantId } : { tenantId };
//           return query(args);
//         },
//         // Se desejar, pode estender outras operações (findUnique, findFirst, update, delete, etc.)
//       },
//     },
//   });
// }
