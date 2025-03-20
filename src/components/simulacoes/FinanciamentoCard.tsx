"use client";

import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import ToggleButton from "../ToggleButton";

/** Estrutura do Financiamento */
export interface FinanciamentoData {
  id: number;
  titulo: string;
  banco: string;
  amortizacao: string; // SAC ou PRICE
  juros: string; // taxa de juros (% ao mês)
  credito: string; // valor do crédito
  entrada: string; // valor da entrada
  prazo: string; // prazo em meses
  parcelas: string; // valor aproximado da parcela (se for manual)
  rendaExigida: string;
  cartorio: string;
  // Esses campos serão calculados
  jurosPagos: string; // total de juros pagos
  valorPagoTotal: string; // total (amortização + juros)
  ultimaParcela: string; // total (amortização + juros)
}

/** Props do FinanciamentoCard */
interface FinanciamentoCardProps {
  data: FinanciamentoData;
  onChange: (id: number, updated: Partial<FinanciamentoData>) => void;
  onDelete: (id: number) => void;
}

export default function FinanciamentoCard({
  data,
  onChange,
  onDelete,
}: FinanciamentoCardProps) {
  // Inicializa o estado local apenas na montagem, sem sincronização posterior com `data`
  const [inputs, setInputs] = useState(() => ({
    titulo: data.titulo,
    banco: data.banco,
    amortizacao: data.amortizacao,
    juros: data.juros,
    credito: data.credito,
    entrada: data.entrada,
    prazo: data.prazo,
    parcelas: data.parcelas,
    rendaExigida: data.rendaExigida,
    cartorio: data.cartorio,
    ultimaParcela: data.ultimaParcela,
  }));

  // Estado para os valores calculados
  const [computed, setComputed] = useState({
    valorPagoTotal: data.valorPagoTotal,
    jurosPagos: data.jurosPagos,
  });

  // Handler para atualizar os inputs. Se o campo modificado for "credito", também atualiza "entrada" para 20% do crédito.
  function handleFieldChange(field: keyof typeof inputs, value: string) {
    if (field === "credito") {
      const credit = parseFloat(value) || 0;
      setInputs((prev) => ({
        ...prev,
        credito: value,
        entrada: (credit * 0.2).toFixed(2), // regra 1: entrada = 20% do crédito
      }));
    } else {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  }

  let ultimaParcela = 0;

  // Efeito para recalcular os valores automaticamente sempre que os inputs relevantes mudam
  useEffect(() => {
    const credit = parseFloat(inputs.credito) || 0;
    const entrada = parseFloat(inputs.entrada) || 0;
    const taxaJuros = (parseFloat(inputs.juros) || 0) / 100 / 12; // exemplo: 12 => 0.12
    const prazo = parseFloat(inputs.prazo) || 0;

    const valorFinanciar = credit - entrada;
    if (valorFinanciar <= 0 || prazo <= 0 || taxaJuros <= 0) {
      setComputed({ valorPagoTotal: "", jurosPagos: "" });
      return;
    }

    let totalPago = 0;
    let totalJuros = 0;
    let parcelaCalculada = 0;

    if (inputs.amortizacao.toUpperCase() === "PRICE") {
      // Fórmula Price: Parcela = P * i / (1 - (1 + i)^(-n))
      const i = taxaJuros;
      const n = prazo;
      const parcela = valorFinanciar * (i / (1 - Math.pow(1 + i, -n)));
      parcelaCalculada = parcela;
      totalPago = parcela * n;
      totalJuros = totalPago - valorFinanciar;
    } else {
      // Fórmula SAC: calculamos a 1ª parcela para referência
      const amortizacaoMensal = valorFinanciar / prazo;
      let saldo = valorFinanciar;
      let somaParcelas = 0;
      for (let mes = 1; mes <= prazo; mes++) {
        const jurosMes = saldo * taxaJuros;
        const parcelaMes = amortizacaoMensal + jurosMes;

        ultimaParcela = parcelaMes;
        if (mes === 1) {
          parcelaCalculada = parcelaMes;
        }
        somaParcelas += parcelaMes;
        saldo -= amortizacaoMensal;
      }
      totalPago = somaParcelas;
      totalJuros = totalPago - valorFinanciar;
    }

    // Atualiza os valores calculados
    setComputed({
      valorPagoTotal: totalPago.toFixed(2),
      jurosPagos: totalJuros.toFixed(2),
    });

    // Regra 3: Atualiza automaticamente as parcelas com base na primeira parcela (ou parcela fixa no Price)
    const newParcelas = parcelaCalculada.toFixed(2);
    if (inputs.parcelas !== newParcelas) {
      setInputs((prev) => ({ ...prev, parcelas: newParcelas }));
    }

    // Regra 4: Renda Exigida = 2 x parcela
    const newRenda = (parcelaCalculada * 3).toFixed(2);
    if (inputs.rendaExigida !== newRenda) {
      setInputs((prev) => ({ ...prev, rendaExigida: newRenda }));
    }

    // Regra 5: Cartório = 5% do crédito
    const newCartorio = (credit * 0.05).toFixed(2);
    if (inputs.cartorio !== newCartorio) {
      setInputs((prev) => ({ ...prev, cartorio: newCartorio }));
    }
  }, [
    inputs.credito,
    inputs.entrada,
    inputs.juros,
    inputs.amortizacao,
    inputs.prazo,
    inputs.ultimaParcela,
  ]);

  // Notifica o pai sempre que os dados (inputs ou computed) mudam
  useEffect(() => {
    onChange(data.id, { ...inputs, ...computed });
  }, [inputs, computed]);

  return (
    <div className="bg-lamaPurpleLight p-[40px] rounded shadow space-y-4">
      {/* Cabeçalho do Card */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">
          Financiamento #{data.id}
        </span>
        <button
          onClick={() => onDelete(data.id)}
          className="text-red-500 hover:text-red-600 text-sm"
        >
          Excluir
        </button>
      </div>

      {/* Layout em DUAS colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Coluna 1 */}

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Título
            </label>
            <input
              type="text"
              value={inputs.titulo}
              onChange={(e) => handleFieldChange("titulo", e.target.value)}
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Banco
            </label>
            <input
              type="text"
              value={inputs.banco}
              onChange={(e) => handleFieldChange("banco", e.target.value)}
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Amortização
            </label>
            <select
              value={inputs.amortizacao}
              onChange={(e) => handleFieldChange("amortizacao", e.target.value)}
              className="flex-1 border border-gray-300 rounded p-2"
            >
              <option value="PRICE">PRICE</option>
              <option value="SAC">SAC</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Crédito
            </label>

            <NumericFormat
              value={inputs.credito}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale={true}
              prefix="R$ "
              onValueChange={({ floatValue }) =>
                handleFieldChange("credito", floatValue?.toString() || "")
              }
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Juros (% ao mês)
            </label>

            <NumericFormat
              value={inputs.juros}
              thousandSeparator={false}
              decimalScale={2}
              fixedDecimalScale={true}
              suffix="%"
              onValueChange={({ floatValue, formattedValue }) =>
                handleFieldChange("juros", floatValue?.toString() || "")
              }
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Entrada
            </label>

            <NumericFormat
              value={inputs.entrada}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale={true}
              prefix="R$ "
              onValueChange={({ floatValue }) =>
                handleFieldChange("entrada", floatValue?.toString() || "")
              }
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>

          {/* Toggle para Última Parcela */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Última Parcela
            </label>
            <ToggleButton
              value={inputs.ultimaParcela === "1"}
              onChange={(newValue) =>
                handleFieldChange("ultimaParcela", newValue ? "1" : "0")
              }
              onColor="bg-green-600"
              offColor="bg-gray-200"
              label={inputs.ultimaParcela === "1" ? "Ativado" : "Desativado"}
            />
          </div>
        </div>

        {/* Coluna 2 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Prazo (meses)
            </label>
            <input
              type="number"
              value={inputs.prazo}
              onChange={(e) => handleFieldChange("prazo", e.target.value)}
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Parcelas
            </label>

            <NumericFormat
              value={inputs.parcelas}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale={true}
              prefix="R$ "
              onValueChange={({ floatValue }) =>
                handleFieldChange("parcelas", floatValue?.toString() || "")
              }
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Renda Exigida
            </label>
            <NumericFormat
              value={inputs.rendaExigida}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale={true}
              prefix="R$ "
              onValueChange={({ floatValue }) =>
                handleFieldChange("rendaExigida", floatValue?.toString() || "")
              }
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Cartório
            </label>

            <NumericFormat
              value={inputs.cartorio}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale={true}
              prefix="R$ "
              onValueChange={({ floatValue }) =>
                handleFieldChange("cartorio", floatValue?.toString() || "")
              }
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>
          {/* Toggle para Última Parcela */}

          <NumericFormat
            value={inputs.ultimaParcela}
            hidden={true}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale={true}
            prefix="R$ "
            className="flex-1 border border-gray-300 bg-gray-400 text-white rounded p-2"
          />

          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Juros Pagos
            </label>

            <NumericFormat
              value={computed.jurosPagos}
              readOnly
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale={true}
              prefix="R$ "
              className="flex-1 border border-gray-300 bg-gray-400 text-white rounded p-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Valor Pago Total
            </label>

            <NumericFormat
              value={computed.valorPagoTotal}
              readOnly
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale={true}
              prefix="R$ "
              className="flex-1 border border-gray-300 bg-gray-400 text-white rounded p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
