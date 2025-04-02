// src/tentantStorage.ts
import { AsyncLocalStorage } from "async_hooks";

export interface TenantContext {
  tenantId: number;
}

export const tenantStorage = new AsyncLocalStorage<TenantContext>();

export function setTenantContext<T>(
  tenantId: number,
  callback: () => Promise<T>
): Promise<T> {
  return tenantStorage.run({ tenantId }, callback);
}
