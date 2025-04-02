"use server";

import { prisma } from "@/lib/prisma";
import ProprietarioFilterSelectClient from "./ProprietarioFilterSelectClient";
import { getTimeComercialVendedores } from "@/lib/actions";

export default async function ProprietarioFilterSelect() {
  // Busca os usuários diretamente no servidor
  const users = await getTimeComercialVendedores();

  return <ProprietarioFilterSelectClient users={users} />;
}
