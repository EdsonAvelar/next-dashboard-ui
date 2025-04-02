import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      cargo: string;
      name?: string | null;
      email?: string | null;
      avatar?: string | null;
      tenantId: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    cargo?: string;
    avatar?: string;
    tenantId: number;
  }
}
