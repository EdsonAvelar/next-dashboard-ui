import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) throw new Error("Credenciais não informadas");
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { roles: true, cargo: true }, // se você quiser incluir roles, ou inclua a role do cargo
        });
        if (user) {
          // console.log(user);
        } else {
          throw new Error("Usuário não encontrado");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Senha incorreta");

        // Retorne o usuário com role; se você quiser incluir outras informações, faça aqui
        return {
          ...user,
          id: user.id.toString(),
          cargo: user.cargo ? user.cargo.name : null,
          role: user.roles.map((r) => r.name).join(","),
          avatar: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Na primeira vez que o usuário faz login, 'user' estará definido.
      if (user) {
        token.id = user.id;

        if ("role" in user) {
          token.role = user.role as string;
        }

        if ("avatar" in user) {
          token.avatar = user.avatar as string;
        }
        if ("cargo" in user) {
          token.cargo = user.cargo as string;
        }
        // ou qualquer campo que contenha a role
      }
      return token;
    },
    async session({ session, token }) {
      // Insere os dados do token na sessão
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.cargo = token.cargo as string;
      session.user.avatar = token.avatar as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// Exportar métodos HTTP explicitamente:
export { handler as GET, handler as POST };
