"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ImageUploadCrop from "./ImageUploadCrop";
import { formatCurrency } from "@/lib/utils";
import { createNegocioComentarioAction } from "@/lib/actions";
import { z } from "zod";
import { toast } from "react-toastify";

// Importa ReactQuill de forma dinâmica (somente client)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { updateNegocioSchema } from "@/lib/formValidationSchema";
import NegocioForm from "./forms/NegocioForm";
import Badge from "./Badge";
import NegocioUploads from "./NegocioUploads";

interface Negocio {
  id: number;
  titulo: string;
  tipo: string;
  valor: number;
  user?: { name: string };
  levantamento?: { status: string };
  consorciado?: {
    id: number;
    avatar?: string;
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
  fechamento?: { id: string; valor: number };
  negocioComentario?: Array<{
    id: number;
    user?: { avatar?: string; name?: string };
    createdAt: string;
    comentario: string;
  }>;
  atividades?: Array<{
    id: string;
    user?: { avatar?: string; name?: string };
    createdAt: string;
    descricao: string;
  }>;
}

interface Simulacao {
  id: number;
  tipo?: string;
  dataProposta?: string;
  consorcios?: any[];
  financiamentos?: any[];
}

interface ClientNegocioEditProps {
  negocio: Negocio;
  user: any;
  simulacoes?: Simulacao[];
  tenantId?: string;
}

export default function ClientNegocioEdit({
  negocio,
  user,
  simulacoes = [],
  tenantId,
}: ClientNegocioEditProps) {
  const [activeTab, setActiveTab] = useState("anotações");
  const [newComment, setNewComment] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Cria objeto com os dados do formulário
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    // Ajusta os tipos (por exemplo, convertendo valores numéricos)
    const dataToValidate = {
      id: negocio.id, // se já tiver o id do negócio
      titulo: rawData.titulo as string,
      nome_contato: rawData.nome_contato as string,
      telefone: rawData.telefone as string,
      tipo: rawData.tipo as string,
      valor: Number(rawData.valor),
    };

    try {
      // Valida os dados com o schema
      const validatedData = updateNegocioSchema.parse(dataToValidate);

      // Se a validação passar, envia os dados à API
      const res = await fetch("/api/updateNegocio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Negócio atualizado com sucesso!");
        router.refresh();
      } else {
        toast.error(result.msg || "Erro ao atualizar o negócio");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Percorre os erros e exibe uma mensagem para cada, incluindo o campo relacionado para melhor detalhe
        err.errors.forEach((error) => {
          const field = error.path.join(".") || "Campo";
          toast.error(`Erro de Validação [${field}]: ${error.message}`);
        });
      } else {
        console.error("Erro desconhecido", err);
        toast.error("Erro ao atualizar o negócio");
      }
    }
  };

  // Handler para adicionar novo comentário usando ReactQuill
  async function handleAddComment() {
    if (!newComment.trim()) return;
    try {
      const response = await createNegocioComentarioAction({
        negocioId: negocio.id,
        comentario: newComment,
        userId: user.id,
      });
      setNewComment("");

      if (response.success) {
        router.refresh(); // Atualiza os dados do servidor
        toast.success(response.msg || "Comentário salvo com sucesso");
      } else {
        toast.error(response.msg || "Erro: " + response.msg);
      }
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 shadow-2xl">
      {/* Cabeçalho */}
      <header className="bg-gray-200 shadow">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center">
            <div className="relative w-20 h-20 mr-4">
              {negocio.consorciado ? (
                <ImageUploadCrop
                  aspect={1}
                  id={negocio.consorciado.id}
                  database="leads"
                  field="avatar"
                  configType="avatar"
                  defaultImage={negocio.consorciado.avatar || "/noAvatar.png"}
                  filename={`avatar_leads_${negocio.consorciado.id}`}
                  folder={`tenants/${tenantId}/avatar/${negocio.consorciado.id}`}
                />
              ) : (
                <Image
                  src="/images/sistema/user-padrao.png"
                  alt="Avatar"
                  fill
                  className="rounded-full object-cover"
                />
              )}
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
              <span className="flex flex-row gap-2 p-2">
                <h2 className="font-semibold text-sm pt-1 text-gray-400">
                  Proprietário:{" "}
                </h2>
                <h2 className="text-lg semibold">
                  {negocio.user ? negocio.user.name : "Sem Proprietário"}
                </h2>
              </span>
              <h2 className="text-xl font-semibold text-gray-800">
                {formatCurrency(negocio.valor)}
              </h2>
              <p className="text-gray-500">Valor do Crédito</p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal com abas */}
      <main className="mx-auto px-4 py-6 flex gap-4">
        {/* Sidebar: Painel de Informações do Cliente */}
        <div className="bg-white rounded-xl shadow-lg w-full md:w-1/4 p-6 space-y-6">
          {/* PESSOA */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">Pessoa</h3>
            <hr className="py-2" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">Nome:</span>{" "}
              {negocio.consorciado?.nome || "--"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">Telefone:</span>{" "}
              {negocio.consorciado?.telefone || "--"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">Email:</span>{" "}
              {negocio.consorciado?.email || "--"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">WhatsApp:</span>{" "}
              {negocio.consorciado?.whatsapp || "--"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">Endereço:</span>{" "}
              {negocio.consorciado?.endereco || "--"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">Complemento:</span>{" "}
              {negocio.consorciado?.complemento || "--"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">CEP:</span>{" "}
              {negocio.consorciado?.cep || "--"}
            </p>
          </div>

          {/* NEGÓCIO */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">Negócio</h3>
            <hr className="py-2" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">Idade do Negócio:</span>{" "}
              Inativo por X dias
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">Criado em:</span>{" "}
              {negocio.createdAt
                ? new Date(negocio.createdAt).toLocaleDateString()
                : "--"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">Funil Atual:</span>{" "}
              {negocio.funil || "--"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">Etapa do Funil:</span>{" "}
              {negocio.etapa || "--"}
            </p>
          </div>

          {/* ADMINISTRATIVO */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              Administrativo
            </h3>
            <hr className="py-2" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">Grupo:</span>{" "}
              {negocio.grupo || "--"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">Cota(s):</span>{" "}
              {negocio.cota || "--"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">Assembleia:</span>{" "}
              {negocio.assembleia || "--"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-sm">Contrato:</span>{" "}
              {negocio.contrato || "--"}
            </p>
            {negocio.fechamento && (
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-sm">Fechamento ID:</span>{" "}
                  {negocio.fechamento.id}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-sm">
                    Valor do Fechamento:
                  </span>{" "}
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

        {/* Área principal com abas */}
        <div className="bg-white rounded-lg shadow-2xl w-full md:w-3/4">
          <nav className="border-b">
            <ul className="flex flex-wrap -mb-px">
              {[
                "anotações",
                "negocio",
                "arquivos",
                // "contato",
                "propostas",
                "atividades",
              ].map((tab) => {
                const icons: { [key: string]: string } = {
                  anotações: "mdi:note-outline",
                  negocio: "mdi:briefcase",
                  // contato: "mdi:phone",
                  arquivos: "mdi:upload",
                  contato: "mdi:phone",
                  propostas: "mdi:file-document-multiple-outline",
                  atividades: "mdi:check-circle",
                };
                return (
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
                      <Icon
                        icon={icons[tab]}
                        className="inline mr-1"
                      />
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-6">
            {/* Aba PERFIL */}
            {activeTab === "negocio" && (
              <NegocioForm
                type={"update"}
                relatedData={{
                  id: negocio.id,
                  nome_contato: negocio.consorciado?.nome,
                  telefone: negocio.consorciado?.telefone, // Exemplo de dados
                  tipo: negocio.tipo,
                  valor: negocio.valor,
                  titulo: negocio.titulo,
                  whatsapp: negocio.consorciado?.whatsapp,
                  email: negocio.consorciado?.email,
                }}
              />
            )}

            {/* Aba CONTATO */}
            {/* {activeTab === "contato" && (
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
                      defaultValue={negocio.consorciado?.nome || ""}
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
                      defaultValue={negocio.consorciado?.telefone || ""}
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
                      defaultValue={negocio.consorciado?.email || ""}
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
                      defaultValue={negocio.consorciado?.whatsapp || ""}
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
                      defaultValue={negocio.consorciado?.endereco || ""}
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
                      defaultValue={negocio.consorciado?.complemento || ""}
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
                      defaultValue={negocio.consorciado?.cep || ""}
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
            )} */}

            {activeTab === "propostas" && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Simulações</h2>
                {simulacoes.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {simulacoes.map((sim) => {
                      const creditConsorcio =
                        sim.consorcios && sim.consorcios.length > 0
                          ? sim.consorcios[0].conCredito
                          : null;
                      const creditFinanciamento =
                        sim.financiamentos && sim.financiamentos.length > 0
                          ? sim.financiamentos[0].finCredito
                          : null;

                      const creditValue =
                        creditConsorcio || creditFinanciamento;
                      return (
                        <a
                          key={sim.id}
                          href={`/simulacoes?simulacao_id=${sim.id}`}
                          className="block p-4 border rounded-lg hover:bg-gray-100 transition"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">
                              Simulação #{sim.id}
                            </span>
                            <span className="text-xs text-gray-500">
                              {sim.dataProposta
                                ? new Date(
                                    sim.dataProposta
                                  ).toLocaleDateString() +
                                  " " +
                                  new Date(
                                    sim.dataProposta
                                  ).toLocaleTimeString()
                                : ""}
                            </span>
                          </div>
                          <p className="text-sm mt-2">
                            Bem: {sim.tipo || "Sem tipo definido"}
                          </p>
                          <p className="text-sm mt-2">
                            Crédito:{" "}
                            {creditConsorcio ? (
                              <Badge type="blue">Consórcio</Badge>
                            ) : (
                              ""
                            )}
                            {creditFinanciamento ? (
                              <Badge type="purple">Financiamento</Badge>
                            ) : (
                              ""
                            )}
                          </p>
                          {creditValue && (
                            <p className="text-sm mt-1">
                              Valor do Crédito: R$ {creditValue.toString()}
                            </p>
                          )}
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <p>Sem simulações</p>
                )}
              </div>
            )}

            {/* Aba OBSERVACOES */}
            {activeTab === "anotações" && (
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                  Anotações
                </h2>

                {/* Formulário para adicionar nova observação usando ReactQuill */}
                <div className="mb-6 p-4 bg-gray-50 border rounded">
                  <h3 className="font-semibold mb-2 text-sm">
                    Adicionar nova anotação
                  </h3>
                  <ReactQuill
                    theme="snow"
                    value={newComment}
                    onChange={setNewComment}
                    className="mb-2"
                  />
                  <button
                    onClick={handleAddComment}
                    className="mt-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                  >
                    Salvar
                  </button>
                </div>

                {/* Lista de observações */}
                <div className="space-y-4">
                  {negocio.negocioComentario &&
                  negocio.negocioComentario.length > 0 ? (
                    negocio.negocioComentario.map((comentario) => (
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
                            {new Date(comentario.createdAt).toLocaleString()}
                          </p>
                          <div
                            className="mt-2 text-gray-700"
                            dangerouslySetInnerHTML={{
                              __html: comentario.comentario,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Nenhuma anotação cadastrada.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "arquivos" && (
              <NegocioUploads
                negocioId={negocio.id}
                folder={`tenants/${tenantId}/uploads/${negocio.consorciado.id}/`}
              />
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
                            {atividade.user?.name || "Desconhecido"}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {atividade.createdAt}
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
