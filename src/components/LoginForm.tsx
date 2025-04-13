"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

interface LoginFormProps {
  csrfToken: string | null;
  homepage: string;
}

import { useRouter } from "next/navigation";
// import { GetHome } from "@/lib/settings";
// import { HOMEPAGE } from "@/lib/settings";

export default function LoginForm({ csrfToken, homepage }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // Chama a API para obter o usuário e as roles com base no email
      const userRes = await fetch("/api/currentUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        // Verifica as roles do usuário e define a rota
        let route = "/dashboard/default"; // caminho padrão
        if (userData.roles.some((role: any) => role.name === "gerente_geral")) {
          route = "/dashboard/geral";
        } else if (
          userData.roles.some((role: any) => role.name === "gerenciar_equipe")
        ) {
          route = "/dashboard/equipes";
        } else if (
          userData.roles.some((role: any) => role.name === "time_comercial")
        ) {
          route = "/dashboard/comercial";
        }
        // Outras condições podem ser adicionadas conforme necessário

        router.push(route);
      } else {
        // Se houver erro ao obter os dados, redireciona para uma página de erro
        router.push("/error");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="relative max-w-md w-full bg-white p-8 rounded shadow">
        {/* Loading bar posicionada no topo da div do login */}
        {loading && (
          <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
            <div className="w-full h-full bg-green-500 animate-loadingBar" />
          </div>
        )}
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            name="csrfToken"
            type="hidden"
            defaultValue={csrfToken ?? ""}
          />
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="email@exemplo.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
