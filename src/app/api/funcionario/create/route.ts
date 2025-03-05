import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Schema para validar os dados do funcionário
const funcionarioSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters long!" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),

  cargo: z.string().min(1, { message: "Cargo is required" }),
});

export async function POST(req: Request) {
  try {
    // Lê o corpo da requisição
    const body = await req.json();

    // Valida os dados usando o schema do Zod
    const data = funcionarioSchema.parse(body);

    // Cria o funcionário no banco de dados utilizando o Prisma.
    // Aqui, cargo é um relacionamento; o valor enviado deve ser o id do cargo (em formato string, que convertida para number).

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newFuncionario = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: passwordHash, // Em produção, lembre-se de hashear a senha!
        avatar: "/noAvatar.png",
        cargo: { connect: { id: parseInt(data.cargo) } },
        status: 1,
      },
    });

    return NextResponse.json(newFuncionario);
  } catch (error: any) {
    console.error("Erro ao salvar funcionário:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
