// // Exemplo: src/prisma/tenantMiddleware.ts

// // Exemplo: src/prisma/tenantMiddleware.ts
// import { prisma } from "@/lib/prisma";
// import { tenantStorage } from "./tenantStorage";

// // Registre o middleware globalmente
// prisma.$use(async (params, next) => {
//   console.log("Testeando middleware", params.model, params.action);
//   // Lista de modelos multi-tenant
//   const tenantScopedModels = ["User", "Negocio", "Agendamento", "Fechamento"];
//   if (params.model && tenantScopedModels.includes(params.model)) {
//     if (
//       [
//         "findUnique",
//         "findFirst",
//         "findMany",
//         "update",
//         "delete",
//         "updateMany",
//         "deleteMany",
//       ].includes(params.action)
//     ) {
//       // Recupera o tenantId do contexto
//       const tenantId = tenantStorage.getStore()?.tenantId;

//       console.log("tenantId", tenantId);

//       if (tenantId) {
//         // Injeta o filtro (atenção: o campo no schema deve ser "tenantId")
//         params.args.where = {
//           ...params.args.where,
//           tenantId: tenantId,
//         };
//       }
//     }
//   }
//   return next(params);
// });
