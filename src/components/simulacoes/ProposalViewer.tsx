"use client";

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
}: {
  simulation: SimulationData;
}) {
  const printRef = useRef<HTMLDivElement>(null);

  const printPage = () => {
    window.print();
  };

  // Funções auxiliares para formatação
  const capitalize = (s: string) => {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

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
    if (match) {
      return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
    }
    return phone;
  };

  return (
    <div className="print-me">
      {/* Imagem de background cobrindo toda a página */}
      <img
        className="back-img"
        src="/images/empresa/proposta/fundo_proposta.png"
        alt="Background Proposta"
      />

      {/* Área que será impressa */}
      <div
        className="container"
        id="printable"
        ref={printRef}
      >
        <div className="row pad">
          {/* Botão fixo para acionar a impressão */}
          <button
            onClick={printPage}
            className="print-button"
          >
            Imprimir
          </button>
          <div className="col-md-12">
            {/* Imagem flutuante indicando o tipo da simulação */}
            <img
              className="mascote-img"
              src={`/images/empresa/proposta/${simulation.tipo.toLowerCase()}.png`}
              alt="Tipo de Simulação"
            />

            <h2 style={{ textAlign: "left" }}>PROPOSTA DE CRÉDITO</h2>
            <hr className="titulo" />

            <table width="100%">
              <tbody>
                <tr>
                  <td align="left">
                    <h4>
                      Consultor Financeiro:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {simulation.user.name}
                      </span>
                    </h4>
                    <h4>
                      Cliente:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {simulation.negocio.lead.nome}
                      </span>
                    </h4>
                    <h4>
                      Telefone:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {formatPhone(simulation.negocio.lead.telefone)}
                      </span>
                    </h4>
                    <h4>
                      CPF:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {simulation.negocio.lead.cpf || ""}
                      </span>
                    </h4>
                  </td>
                  <td align="left">
                    <h4>
                      Protocolo:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {new Date().getFullYear()}/{simulation.id}
                      </span>
                    </h4>
                    <h4>
                      Tipo do Bem:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {capitalize(simulation.tipo)}
                      </span>
                    </h4>
                    {simulation.tipo.toUpperCase() !== "IMOVEL" && (
                      <h4>
                        Fabricante/Modelo:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {/* Insira dados de modelo/ano, se disponíveis */}
                        </span>
                      </h4>
                    )}
                    <h4>
                      Data da Criação:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {formatDate(new Date())}
                      </span>
                    </h4>
                    <h4>
                      Validade da Proposta:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {formatDate(new Date())}
                      </span>
                    </h4>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Exibição das propostas de Financiamento */}
            {simulation.financiamentos &&
              simulation.financiamentos.map((financiamento, index) => (
                <div key={`fin-${index}`}>
                  <hr className="proposta" />
                  <h3 style={{ textAlign: "left" }}>
                    PROPOSTA {index + 1}: {financiamento.titulo}
                  </h3>
                  <table width="100%">
                    <tbody>
                      <tr>
                        <td align="left">
                          <h4>Modalidade de Crédito: FINANCIAMENTO BANCÁRIO</h4>
                          <h4>
                            Empresa:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {financiamento.empresa}
                            </span>
                          </h4>
                          <h4>
                            Valor do Bem:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {financiamento.credito}
                            </span>
                          </h4>
                          <h4>
                            Entrada:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {financiamento.entrada}
                            </span>
                          </h4>
                          {financiamento.ultimaParcela === 0 ? (
                            <h4>
                              Parcela:{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {financiamento.parcelas}
                              </span>
                            </h4>
                          ) : (
                            <>
                              <h4>
                                Primeira Parcela:{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {financiamento.parcelas}
                                </span>
                              </h4>
                              <h4>
                                Última Parcela:{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {financiamento.ultimaParcela}
                                </span>
                              </h4>
                            </>
                          )}
                          <h4>
                            Prazo:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {financiamento.prazo} Meses (
                              {Math.round(financiamento.prazo / 12)} Anos)
                            </span>
                          </h4>
                        </td>
                        <td align="left">
                          {simulation.tipo.toUpperCase() === "IMOVEL" && (
                            <>
                              <h4>
                                Despesas Cartoriais/ITBI:{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {financiamento.cartorio}
                                </span>
                              </h4>
                              <h4>
                                Tarifa de avaliação, reavaliação:{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  R$ 2.400,00
                                </span>
                              </h4>
                            </>
                          )}
                          <h4>
                            Renda líquida mínima exigida:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {financiamento.rendaExigida}
                            </span>
                          </h4>
                          <h4>
                            Total de Juros:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {financiamento.jurosPagos}
                            </span>
                          </h4>
                          <h4>
                            Valor Final do Bem:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {financiamento.valPagoTotal}
                            </span>
                          </h4>
                          <h4>
                            Sistema de Amortização:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {financiamento.amortizacao.toUpperCase()}
                            </span>
                          </h4>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}

            {/* Exibição das propostas de Consórcio */}
            {simulation.consorcios &&
              simulation.consorcios.map((consorcio, index) => (
                <div key={`con-${index}`}>
                  <hr className="proposta" />
                  <h3 style={{ textAlign: "left" }}>
                    PROPOSTA{" "}
                    {simulation.financiamentos
                      ? simulation.financiamentos.length + index + 1
                      : index + 1}{" "}
                    : {consorcio.titulo}
                  </h3>
                  <table width="100%">
                    <tbody>
                      <tr>
                        <td align="left">
                          <h4>
                            Modalidade de Crédito: CARTA DE CRÉDITO (CONSÓRCIO)
                          </h4>
                          <h4>
                            Empresa:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {consorcio.empresa}
                            </span>
                          </h4>
                          <h4>
                            Valor do Bem:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {consorcio.credito}
                            </span>
                          </h4>
                          <h4>
                            Adesão:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {consorcio.entrada}
                            </span>
                          </h4>
                          <h4>
                            Parcela:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {consorcio.parcelaCheia}
                            </span>
                          </h4>
                          <h4>
                            *Parcela Reduzida:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {consorcio.parcelaReduzida}
                            </span>
                          </h4>
                          <h4>
                            Prazo:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {consorcio.prazo} Meses (
                              {Math.round(consorcio.prazo / 12)} Anos)
                            </span>
                          </h4>
                        </td>
                        <td align="left">
                          {consorcio.lance && (
                            <>
                              <h4>
                                *Lance:{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {consorcio.lance}
                                </span>
                              </h4>
                              {consorcio.creditoPosContemplacao && (
                                <h4>
                                  Crédito Após Contemplação:{" "}
                                  <span style={{ fontWeight: "bold" }}>
                                    {consorcio.creditoPosContemplacao}
                                  </span>
                                </h4>
                              )}
                            </>
                          )}
                          {simulation.tipo.toUpperCase() === "IMOVEL" && (
                            <h4>
                              Despesas Cartoriais:{" "}
                              <span style={{ fontWeight: "bold" }}>
                                até 10% do Crédito
                              </span>
                            </h4>
                          )}
                          <h4>
                            Renda Mínima Exigida:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {consorcio.rendaExigida}
                            </span>
                          </h4>
                          <h4>
                            Total de Taxas:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {consorcio.jurosPagos}
                            </span>
                          </h4>
                          <h4>
                            Valor Final do Bem:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {consorcio.valorPago}
                            </span>
                          </h4>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}

            <p>
              * Sujeito à aprovação de crédito.
              <br />
              ** Esta proposta é uma simulação, não gerando qualquer espécie de
              obrigação entre as partes.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pad {
          margin-top: 10%;
        }
        .mascote-img {
          padding-right: 50px;
          width: 250px;
          height: 150px;
          position: fixed;
          right: -50px;
        }
        .back-img {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -5;
        }
        p {
          font-family: "Times New Roman", Times, serif;
          font-size: 100%;
        }
        .container {
          width: 100%;
          height: 100%;
        }
        hr.proposta {
          border-color: #c69316;
          border-width: 5px 0;
        }
        hr.titulo {
          border-color: #c69316;
          border-style: solid none;
          border-width: 5px 0;
          margin: 16px 0;
        }
        /* Regras para impressão: somente a div .print-me será visível e o conteúdo não ficará centralizado */
        @media print {
          body * {
            visibility: hidden;
          }
          .non-printable {
                display: none !important;
                visibility: hidden !important;
            }

          .print-me,
          .print-me * {
            visibility: visible;
          }
          .print-me {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-me .row.pad {
            margin-top: 0;
          }
          /* Força o alinhamento à esquerda para textos e imagens dentro de .print-me */
          .print-me h2,
          .print-me h3,
          .print-me h4,
          .print-me p,
          .print-me table,
          .print-me img {
            text-align: left !important;
          }
          .print-button {
            display: none;
          }
        }
        .print-button {
         
          top: 20px;
          right: 20px;
          padding: 10px 20px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
