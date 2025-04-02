"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useRef } from "react";

export interface SimulationData {
  id: number;
  tipo: string;
  user: { name: string };
  negocio: { lead: { nome: string; telefone: string; cpf?: string } };
  financiamentos: SimulationFinancingData[];
  consorcios: SimulationConsortiumData[];
}

export interface SimulationFinancingData {
  titulo: string;
  empresa: string;
  credito: string;
  entrada: string;
  parcelas: string;
  ultimaParcela: number;
  prazo: number;
  cartorio: string;
  rendaExigida: string;
  jurosPagos: string;
  valPagoTotal: string;
  amortizacao: string;
}

export interface SimulationConsortiumData {
  titulo: string;
  empresa: string;
  credito: string;
  entrada: string;
  parcelaCheia: string;
  parcelaReduzida: string;
  prazo: number;
  lance?: string;
  creditoPosContemplacao?: string;
  rendaExigida: string;
  jurosPagos: string;
  valorPago: string;
}

export default function ProposalViewer({
  simulation,
  configs,
}: {
  simulation: SimulationData;
  configs: Record<string, string>;
}) {
  const printRef = useRef<HTMLDivElement>(null);

  const printPage = () => window.print();

  // Funções auxiliares para formatação
  const capitalize = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

  const formatDate = (date: Date) => {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  const formatPhone = (phone: string) => {
    const regex = /(\d{2})(\d{1})(\d{4})(\d{4})/;
    const match = phone.match(regex);
    return match ? `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}` : phone;
  };

  return (
    <>
      {/* Regras de impressão: esconde elementos não impressos e define margens para A4 */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible !important;
            
          }
          .no-print {
            display: none !important;
            padding: 0 !important;
            margin: 0 !important;
            

          }
          @page {
            size: A4 portrait;
            margin: 0mm;
            
          }
        }
      `}</style>

      <div className="relative ">
        {/* Botão de impressão fixo (não será impresso) */}
        <button
          onClick={printPage}
          className="no-print fixed top-5 right-5 px-4 py-2 bg-purple-600 text-white rounded shadow flex items-center gap-2"
        >
          <Icon
            icon="heroicons-outline:printer"
            className="h-5 w-5"
          />
          Imprimir
        </button>
        <button
          onClick={() => window.history.back()}
          className="no-print fixed top-5 left-5 px-4 py-2 bg-gray-600 text-white rounded shadow flex items-center gap-2"
        >
          <Icon
            icon="heroicons-outline:arrow-left"
            className="h-5 w-5"
          />
          Voltar
        </button>

        {/* Área de visualização da proposta com aparência de folha A4 */}
        <div
          ref={printRef}
          className="print-area mx-auto bg-white border border-gray-300 rounded shadow-lg relative"
          style={{
            width: "210mm",
            height: "297mm",
            padding: "10mm",
          }}
        >
          {/* Imagem de fundo posicionada atrás de todo o conteúdo */}
          <img
            src={configs.simulacao_folha_proposta}
            alt="Background da proposta"
            className="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none"
          />

          {/* Conteúdo da proposta em camada superior */}
          <div className="relative z-10">
            <div className="flex flex-col h-full pt-32">
              {/* Cabeçalho com imagem e título */}
              <div className="relative">
                <img
                  src={configs.icon}
                  alt="Tipo de Simulação"
                  className="absolute -top-14 -right-4 object-contain z-1000"
                  style={{ width: "128px", height: "128px" }}
                />
                <h2 className="text-2xl text-gray-800">PROPOSTA DE CRÉDITO</h2>
                <hr className="border-t-4 border-yellow-600 my-2" />
              </div>

              {/* Dados do consultor e cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-bold">Consultor Financeiro:</span>{" "}
                    {simulation.user.name}
                  </p>
                  <p>
                    <span className="font-bold">Cliente:</span>{" "}
                    {simulation.negocio.lead.nome}
                  </p>
                  <p>
                    <span className="font-bold">Telefone:</span>{" "}
                    {formatPhone(simulation.negocio.lead.telefone)}
                  </p>
                  <p>
                    <span className="font-bold">CPF:</span>{" "}
                    {simulation.negocio.lead.cpf || ""}
                  </p>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-bold">Protocolo:</span>{" "}
                    {new Date().getFullYear()}/{simulation.id}
                  </p>
                  <p>
                    <span className="font-bold">Tipo do Bem:</span>{" "}
                    {capitalize(simulation.tipo)}
                  </p>
                  {simulation.tipo.toUpperCase() !== "IMOVEL" && (
                    <p>
                      <span className="font-bold">Fabricante/Modelo:</span>{" "}
                      {/* Inserir dados se disponíveis */}
                    </p>
                  )}
                  <p>
                    <span className="font-bold">Data da Criação:</span>{" "}
                    {formatDate(new Date())}
                  </p>
                  <p>
                    <span className="font-bold">Validade da Proposta:</span>{" "}
                    {formatDate(new Date())}
                  </p>
                </div>
              </div>
              <div className="py-2"></div>
              {/* Financiamentos */}
              {simulation.financiamentos &&
                simulation.financiamentos.map((financiamento, index) => (
                  <div
                    key={`fin-${index}`}
                    className="py-4 border-t border-yellow-600 "
                  >
                    <h3 className="text-lg text-center font-semibold ">
                      PROPOSTA {index + 1}: {financiamento.titulo}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div className="space-y-1">
                        <p>
                          Modalidade:{" "}
                          <span className="font-bold">
                            FINANCIAMENTO BANCÁRIO
                          </span>
                        </p>
                        <p>
                          Empresa:{" "}
                          <span className="font-bold">
                            {financiamento.empresa}
                          </span>
                        </p>
                        <p>
                          Valor do Bem:{" "}
                          <span className="font-bold">
                            {financiamento.credito}
                          </span>
                        </p>
                        <p>
                          Entrada:{" "}
                          <span className="font-bold">
                            {financiamento.entrada}
                          </span>
                        </p>
                        {financiamento.ultimaParcela === 0 ? (
                          <p>
                            Parcela:{" "}
                            <span className="font-bold">
                              {financiamento.parcelas}
                            </span>
                          </p>
                        ) : (
                          <>
                            <p>
                              Primeira Parcela:{" "}
                              <span className="font-bold">
                                {financiamento.parcelas}
                              </span>
                            </p>
                            <p>
                              Última Parcela:{" "}
                              <span className="font-bold">
                                {financiamento.ultimaParcela}
                              </span>
                            </p>
                          </>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p>
                          Prazo:{" "}
                          <span className="font-bold">
                            {financiamento.prazo} Meses (
                            {Math.round(financiamento.prazo / 12)} Anos)
                          </span>
                        </p>
                        {simulation.tipo.toUpperCase() === "IMOVEL" && (
                          <>
                            <p>
                              Despesas Cartoriais/ITBI:{" "}
                              <span className="font-bold">
                                {financiamento.cartorio}
                              </span>
                            </p>
                            <p>
                              Tarifa de avaliação, reavaliação:{" "}
                              <span className="font-bold">R$ 2.400,00</span>
                            </p>
                          </>
                        )}
                        <p>
                          Renda líquida mínima exigida:{" "}
                          <span className="font-bold">
                            {financiamento.rendaExigida}
                          </span>
                        </p>
                        <p>
                          Total de Juros:{" "}
                          <span className="font-bold">
                            {financiamento.jurosPagos}
                          </span>
                        </p>
                        <p>
                          Valor Final do Bem:{" "}
                          <span className="font-bold">
                            {financiamento.valPagoTotal}
                          </span>
                        </p>
                        <p>
                          Sistema de Amortização:{" "}
                          <span className="font-bold">
                            {financiamento.amortizacao.toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Consórcios */}
              {simulation.consorcios &&
                simulation.consorcios.map((consorcio, index) => (
                  <div
                    key={`con-${index}`}
                    className="py-4 border-t border-yellow-600"
                  >
                    <h3 className="text-lg text-center font-semibold">
                      PROPOSTA {index + 1}: {consorcio.titulo}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div className="space-y-1">
                        <p>
                          Modalidade:{" "}
                          <span className="font-bold">CONSÓRCIO</span>
                        </p>
                        <p>
                          Empresa:{" "}
                          <span className="font-bold">{consorcio.empresa}</span>
                        </p>
                        <p>
                          Valor do Bem:{" "}
                          <span className="font-bold">{consorcio.credito}</span>
                        </p>
                        <p>
                          Adesão:{" "}
                          <span className="font-bold">{consorcio.entrada}</span>
                        </p>
                        <p>
                          Parcela:{" "}
                          <span className="font-bold">
                            {consorcio.parcelaCheia}
                          </span>
                        </p>
                        <p>
                          *Parcela Reduzida:{" "}
                          <span className="font-bold">
                            {consorcio.parcelaReduzida}
                          </span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p>
                          Prazo:{" "}
                          <span className="font-bold">
                            {consorcio.prazo} Meses (
                            {Math.round(consorcio.prazo / 12)} Anos)
                          </span>
                        </p>
                        {consorcio.lance && Number(consorcio.lance) > 0 && (
                          <>
                            <p>
                              *Lance:{" "}
                              <span className="font-bold">
                                {consorcio.lance}
                              </span>
                            </p>
                            {consorcio.creditoPosContemplacao && (
                              <p>
                                Crédito Após Contemplação:{" "}
                                <span className="font-bold">
                                  {consorcio.creditoPosContemplacao}
                                </span>
                              </p>
                            )}
                          </>
                        )}
                        {simulation.tipo.toUpperCase() === "IMOVEL" && (
                          <p>
                            Despesas Cartoriais:{" "}
                            <span className="font-bold">
                              até 10% do Crédito
                            </span>
                          </p>
                        )}
                        <p>
                          Renda Mínima Exigida:{" "}
                          <span className="font-bold">
                            {consorcio.rendaExigida}
                          </span>
                        </p>
                        <p>
                          Total de Taxas:{" "}
                          <span className="font-bold">
                            {consorcio.jurosPagos}
                          </span>
                        </p>
                        <p>
                          Valor Final do Bem:{" "}
                          <span className="font-bold">
                            {consorcio.valorPago}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

              <p className="text-xs text-gray-600 mt-1">
                * Sujeito à aprovação de crédito.
                <br />
                ** Esta proposta é uma simulação, não gerando qualquer espécie
                de obrigação entre as partes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
