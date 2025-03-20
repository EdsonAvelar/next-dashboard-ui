"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Negocio {
  titulo: string;
  tipo: string;
  valor: number;
  levantamento?: { status: string };
  lead?: {
    nome?: string;
    telefone?: string;
    email?: string;
    whatsapp?: string;
    endereco?: string;
    complemento?: string;
    cep?: string;
  };
  createdAt?: string;
  funil?: string;
  etapa?: string;
  grupo?: string;
  cota?: string;
  assembleia?: string;
  contrato?: string;
  fechamento?: {
    id: string;
    valor: number;
  };
  comentarios?: Array<{
    id: string;
    user?: { avatar?: string; name?: string };
    created_at: string;
    comentario: string;
  }>;
  atividades?: Array<{
    id: string;
    user?: { avatar?: string; name?: string };
    created_at: string;
    descricao: string;
  }>;
}

export default function ClientNegocioEdit({ negocio }: { negocio: Negocio }) {
  const [activeTab, setActiveTab] = useState("perfil");

  // Exemplo de submit para os formulários (a implementação real deverá integrar com sua API)
interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

const handleSubmit = (e: HandleSubmitEvent): void => {
    e.preventDefault();
    // Aqui você pode capturar os dados dos formulários e enviar via fetch/axios para sua API
    console.log("Dados salvos!");
};

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center">
            <div className="relative w-20 h-20 mr-4">
              <Image
                src="/images/sistema/user-padrao.png"
                alt="Avatar"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {negocio.titulo}
              </h1>
              <p className="text-gray-600">{negocio.tipo}</p>
              <div className="mt-2">
                {negocio.levantamento?.status === "APROVADO" ? (
                  <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                    APROVADO
                  </span>
                ) : negocio.levantamento?.status === "REJEITADO" ? (
                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm">
                    REJEITADO
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm">
                    EM APROVAÇÃO
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-right">
              <h2 className="text-xl font-semibold text-gray-800">
                R$ {Number(negocio.valor).toFixed(2)}
              </h2>
              <p className="text-gray-500">Valor do Crédito</p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal com abas */}
      <main className="container mx-auto px-4 py-6 flex gap-2">
        {/* Painel de Informações do cliente (sidebar) */}
        <div className="bg-white rounded-lg shadow w-full md:w-1/4 p-4">
          {/* PESSOA */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-700 mb-2">Pessoa</h3>
            <p className="text-sm text-gray-600">
              <strong>Nome:</strong> {negocio.lead?.nome || "--"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Telefone:</strong> {negocio.lead?.telefone || "--"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {negocio.lead?.email || "--"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>WhatsApp:</strong> {negocio.lead?.whatsapp || "--"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Endereço:</strong> {negocio.lead?.endereco || "--"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Complemento:</strong> {negocio.lead?.complemento || "--"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>CEP:</strong> {negocio.lead?.cep || "--"}
            </p>
          </div>

          {/* NEGÓCIO */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-700 mb-2">Negócio</h3>
            <p className="text-sm text-gray-600">
              <strong>Idade do Negócio:</strong> Inativo por X dias
            </p>
            <p className="text-sm text-gray-600">
              <strong>Criado em:</strong>{" "}
              {negocio.createdAt
                ? new Date(negocio.createdAt).toLocaleDateString()
                : "--"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Funil Atual:</strong> {negocio.funil || "--"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Etapa do Funil:</strong> {negocio.etapa || "--"}
            </p>
          </div>

          {/* CLIENTE */}
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Cliente</h3>
            <p className="text-sm text-gray-600">
              <strong>Grupo:</strong> {negocio.grupo || "--"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Cota(s):</strong> {negocio.cota || "--"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Assembleia:</strong> {negocio.assembleia || "--"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Contrato:</strong> {negocio.contrato || "--"}
            </p>

            {/* Se houver dados de fechamento, exiba */}
            {negocio.fechamento && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  <strong>Fechamento ID:</strong> {negocio.fechamento.id}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Valor do Fechamento:</strong>{" "}
                  {negocio.fechamento.valor
                    ? `R$ ${Number(negocio.fechamento.valor).toFixed(2)}`
                    : "--"}
                </p>
                <a
                  href={`/negocios/fechamento?id=${negocio.fechamento.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Acessar Fechamento
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Área principal (conteúdo das abas) */}
        <div className="bg-white rounded-lg shadow w-full md:w-3/4">
          {/* Navegação por abas */}
          <nav className="border-b">
            <ul className="flex flex-wrap -mb-px">
              {[
                "perfil",
                "contato",
                "negocio",
                "observacoes",
                "atividades",
              ].map((tab) => (
                <li
                  key={tab}
                  className="mr-2"
                >
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`inline-block py-2 px-4 border-b-2 font-medium transition-colors ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Conteúdo das abas */}
          <div className="p-6">
            {/* Aba PERFIL */}
            {activeTab === "perfil" && (
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                  Dados do Perfil
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Título do Negócio
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      defaultValue={negocio.titulo}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo de Negócio
                    </label>
                    <input
                      type="text"
                      name="tipo"
                      defaultValue={negocio.tipo}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Valor do Crédito
                  </label>
                  <input
                    type="number"
                    name="valor"
                    defaultValue={negocio.valor}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  Salvar Alterações
                </button>
              </form>
            )}

            {/* Aba CONTATO */}
            {activeTab === "contato" && (
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                  Dados de Contato
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="nome"
                      defaultValue={negocio.lead?.nome || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Telefone
                    </label>
                    <input
                      type="text"
                      name="telefone"
                      defaultValue={negocio.lead?.telefone || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={negocio.lead?.email || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      name="whatsapp"
                      defaultValue={negocio.lead?.whatsapp || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Endereço
                    </label>
                    <input
                      type="text"
                      name="endereco"
                      defaultValue={negocio.lead?.endereco || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="complemento"
                      defaultValue={negocio.lead?.complemento || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CEP
                    </label>
                    <input
                      type="text"
                      name="cep"
                      defaultValue={negocio.lead?.cep || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  Salvar Alterações
                </button>
              </form>
            )}

            {/* Aba NEGOCIO */}
            {activeTab === "negocio" && (
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                  Informações do Negócio
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Grupo
                    </label>
                    <input
                      type="text"
                      name="grupo"
                      defaultValue={negocio.grupo || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cota(s)
                    </label>
                    <input
                      type="text"
                      name="cota"
                      defaultValue={negocio.cota || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Data Assembleia
                    </label>
                    <input
                      type="text"
                      name="assembleia"
                      defaultValue={negocio.assembleia || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contrato
                    </label>
                    <input
                      type="text"
                      name="contrato"
                      defaultValue={negocio.contrato || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  Salvar Alterações
                </button>
              </form>
            )}

            {/* Aba OBSERVACOES */}
            {activeTab === "observacoes" && (
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                  Observações
                </h2>
                <div className="space-y-4">
                  {negocio.comentarios && negocio.comentarios.length > 0 ? (
                    negocio.comentarios.map((comentario) => (
                      <div
                        key={comentario.id}
                        className="flex items-start space-x-4 p-4 border rounded-md bg-gray-50"
                      >
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <Image
                            src={
                              comentario.user?.avatar ||
                              "/images/sistema/user-padrao.png"
                            }
                            alt="Avatar"
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-gray-800">
                            {comentario.user?.name || "Usuário Desconhecido"}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {comentario.created_at}
                          </p>
                          <p className="mt-2 text-gray-700">
                            {comentario.comentario}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Nenhuma observação cadastrada.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Aba ATIVIDADES */}
            {activeTab === "atividades" && (
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                  Atividades
                </h2>
                <div className="space-y-4">
                  {negocio.atividades && negocio.atividades.length > 0 ? (
                    negocio.atividades.map((atividade) => (
                      <div
                        key={atividade.id}
                        className="flex items-start space-x-4 p-4 border rounded-md bg-gray-50"
                      >
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <Image
                            src={
                              atividade.user?.avatar ||
                              "/images/sistema/user-padrao.png"
                            }
                            alt="Avatar"
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-gray-800">
                            author {atividade.user?.name || "Desconhecido"}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {atividade.created_at}
                          </p>
                          <p className="mt-2 text-gray-700">
                            {atividade.descricao}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Nenhuma atividade cadastrada.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
