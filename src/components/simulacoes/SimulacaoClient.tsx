// components/SimulacaoClient.tsx
"use client";

import { useState, useTransition } from "react";
import { redirect, useRouter } from "next/navigation";
import ConsorcioCard, { ConsorcioData } from "./ConsorcioCard";
import FinanciamentoCard, { FinanciamentoData } from "./FinanciamentoCard";
import { salvarSimulacao } from "@/lib/actions";
import { toast } from "react-toastify";

interface Negocio {
  id: number;
  consultor: string;
  cliente: string;
  cpf?: string;
  tipoCredito: string;
}

export const NegocioTipoOptions = [
  { value: "CARRO", label: "Carro" },
  { value: "MOTO", label: "Moto" },
  { value: "CAMINHAO", label: "Caminhão" },
  { value: "TERRENO", label: "Terreno" },
  { value: "MAQUINARIO", label: "Maquinário" },
  { value: "SERVICO", label: "Serviço" },
];

interface SimulacaoClientProps {
  initialNegocio: Negocio;
}

export default function SimulacaoClient({
  initialNegocio,
}: SimulacaoClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Os campos consultor e cliente são read-only
  const [consultor] = useState(initialNegocio.consultor);
  const [cliente] = useState(initialNegocio.cliente);
  const [cpf, setCpf] = useState(initialNegocio.cpf || "");
  const [tipoCredito, setTipoCredito] = useState(initialNegocio.tipoCredito);

  // Estados para os cards
  const [consorcios, setConsorcios] = useState<ConsorcioData[]>([]);
  const [financiamentos, setFinanciamentos] = useState<FinanciamentoData[]>([]);

  
  function handleAddConsorcio() {
    setConsorcios((prev) => [
      ...prev,
      {
        id: Date.now(),
        titulo: "CONSÓRCIO",
        credito: "200000",
        adesao: "0",
        entrada: "20000",
        parcelaCheia: "0",
        parcelaReduzida: "0",
        lance: "",
        prazo: "220",
        creditoPosContemplacao: "",
        rendaExigida: "",
        valorPago: "0",
        jurosPagos: "0",
        parcelasEmbutidas: "0",
        banco: "ADMINSTRADORA",
        ultimaParcela: "",
      },
    ]);
  }

  function handleAddFinanciamento() {
    setFinanciamentos((prev) => [
      ...prev,
      {
        id: Date.now(),
        titulo: "FINANCIAMENTO",
        banco: "Bradesco",
        amortizacao: "PRICE",
        juros: "12",
        credito: "200000",
        entrada: "40000",
        prazo: "360",
        parcelas: "",
        rendaExigida: "",
        cartorio: "",
        jurosPagos: "",
        valorPagoTotal: "",
        ultimaParcela: "",
      },
    ]);
  }

  function handleConsorcioChange(id: number, updated: Partial<ConsorcioData>) {
    setConsorcios((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  }

  function handleFinanciamentoChange(
    id: number,
    updated: Partial<FinanciamentoData>
  ) {
    setFinanciamentos((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updated } : f))
    );
  }

  function handleDeleteConsorcio(id: number) {
    setConsorcios((prev) => prev.filter((c) => c.id !== id));
  }

  function handleDeleteFinanciamento(id: number) {
    setFinanciamentos((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleGerarProposta() {
    // Consolida os dados para enviar
    const payload = {
      tipo: tipoCredito, // ou outro valor que defina o tipo de simulação
      negocioId: initialNegocio.id,
      userId: 1, // substitua pelo id do usuário logado
      consorcios: consorcios.map((c) => ({
        titulo: c.titulo,
        empresa: c.banco, // ajuste se necessário
        credito: c.credito,
        adesao: c.adesao,
        entrada: c.entrada,
        parcelaCheia: c.parcelaCheia,
        parcelaReduzida: c.parcelaReduzida,
        lance: c.lance,
        prazo: parseInt(c.prazo),
        creditoPosContemplacao: c.creditoPosContemplacao,
        rendaExigida: c.rendaExigida,
        valorPago: c.valorPago,
        jurosPagos: c.jurosPagos,
        parcelasEmbutidas: parseInt(c.parcelasEmbutidas as any),
      })),
      financiamentos: financiamentos.map((f) => ({
        titulo: f.titulo,
        amortizacao: f.amortizacao,
        banco: f.banco,
        juros: f.juros,
        credito: f.credito,
        entrada: f.entrada,
        parcelas: f.parcelas,
        ultimaParcela: f.ultimaParcela,
        prazo: parseInt(f.prazo),
        rendaExigida: f.rendaExigida,
        cartorio: f.cartorio,
        jurosPagos: f.jurosPagos,
        valorPagoTotal: f.valorPagoTotal,
      })),
    };

  

    // Utilizamos startTransition para chamar a server action
    startTransition(async () => {
      try {
        // A função salvarSimulacao é uma server action que, se bem-sucedida,
        // redireciona internamente para /propostas/exibir?simulacao_id=<id>
        const ret = await salvarSimulacao(payload);

        if (ret.success && ret.simulacaoId) {
          router.push(`/propostas/exibir?simulacao_id=${ret.simulacaoId}`);
        } else {
          toast.error("Erro ao salvar simulação: " + ret.msg);
        }
      } catch (error: any) {
        console.error("Erro ao salvar simulação:", error);
        toast.error("Erro ao salvar simulação: " + error);
      }
    });
  }

  return (
    <div className="mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Criação de Proposta</h1>

      {/* Cabeçalho */}
      <section className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-600">Dados Iniciais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Consultor
            </label>
            <input
              type="text"
              value={consultor}
              readOnly
              className="w-full border border-gray-300 rounded p-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Cliente</label>
            <input
              type="text"
              value={cliente}
              readOnly
              className="w-full border border-gray-300 rounded p-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              placeholder="000.000.000-00"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Tipo de Crédito
            </label>
            <input
              type="text"
              value={tipoCredito}
              onChange={(e) => setTipoCredito(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              placeholder="Consórcio, Financiamento, etc."
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={handleAddConsorcio}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            +Add Consórcio
          </button>
          <button
            onClick={handleAddFinanciamento}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            +Add Financiamento
          </button>
        </div>
      </section>

      {/* Lista de Consórcios */}
      {consorcios.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-600">Consórcios</h2>
          {consorcios.map((cons) => (
            <ConsorcioCard
              key={cons.id}
              data={cons}
              onChange={handleConsorcioChange}
              onDelete={handleDeleteConsorcio}
            />
          ))}
        </section>
      )}

      {/* Lista de Financiamentos */}
      {financiamentos.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-600">
            Financiamentos
          </h2>
          {financiamentos.map((fin) => (
            <FinanciamentoCard
              key={fin.id}
              data={fin}
              onChange={handleFinanciamentoChange}
              onDelete={handleDeleteFinanciamento}
            />
          ))}
        </section>
      )}

      {/* Botão para gerar a proposta */}

      {(consorcios.length > 0 || financiamentos.length > 0) && (
        <div className="flex justify-end">
          <button
            onClick={handleGerarProposta}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            Gerar Proposta
          </button>
        </div>
      )}
    </div>
  );
}
