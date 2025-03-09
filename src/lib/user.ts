// lib/user.ts

import { UserProfile } from "./actions";

export type Role = {
  id: number;
  name: string;
  // Outras propriedades, se houver...
};

export function hasRole(user: UserProfile, roleName: string): boolean {
  // Se o array de roles não existir ou estiver vazio, retorna false
  if (!user.roles || user.roles.length === 0) return false;
  return user.roles.some((role) => role.name === roleName);
}
