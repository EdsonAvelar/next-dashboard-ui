"use client";

import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import ToggleButton from "../ToggleButton";

export interface ConsorcioData {
  id: number;
  titulo: string;
  banco: string; // ex.: 'Bradesco', 'Itaú', etc.
  credito: string; // valor do crédito
  adesao: string; // taxa de adesão
  entrada: string; // valor da entrada
  parcelaCheia: string; // parcela cheia
  parcelaReduzida: string; // parcela reduzida
  lance: string; // lance
  prazo: string; // quantidade de parcelas (meses)
  creditoPosContemplacao: string;
  rendaExigida: string;
  valorPago: string; // total pago
  jurosPagos: string; // total de juros pagos
  parcelasEmbutidas: string; // inteiro
  ultimaParcela: string; // "1" se ativado, "0" se desativado
}

interface ConsorcioCardProps {
  data: ConsorcioData;
  onChange: (id: number, updated: Partial<ConsorcioData>) => void;
  onDelete: (id: number) => void;
}

export default function ConsorcioCard({
  data,
  onChange,
  onDelete,
}: ConsorcioCardProps) {
  // Inicializa os inputs editáveis apenas uma vez
  const [inputs, setInputs] = useState(() => ({
    titulo: data.titulo,
    banco: data.banco,
    credito: data.credito,
    adesao: data.adesao,
    entrada: data.entrada,
    parcelaCheia: data.parcelaCheia,
    parcelaReduzida: data.parcelaReduzida,
    lance: data.lance,
    prazo: data.prazo,
    creditoPosContemplacao: data.creditoPosContemplacao,
    rendaExigida: data.rendaExigida,
    valorPago: data.valorPago,
    jurosPagos: data.jurosPagos,
    parcelasEmbutidas: data.parcelasEmbutidas,
    ultimaParcela: data.ultimaParcela, // "1" ou "0"
  }));

  // Estado para os valores calculados (separado para evitar flickering)
  const [computed, setComputed] = useState({
    valorPago: data.valorPago,
    jurosPagos: data.jurosPagos,
  });

  // Handler para atualizar os inputs.
  // Se o campo for "credito", atualiza automaticamente "entrada" para 20% do crédito.
  function handleFieldChange(field: keyof typeof inputs, value: string) {
    if (field === "credito") {
      const credit = parseFloat(value) || 0;
      setInputs((prev) => ({
        ...prev,
        credito: value,
        entrada: (credit * 0.2).toFixed(2),
      }));
    } else {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  }

  // Recalcula os valores computados sempre que os inputs relevantes mudam
  useEffect(() => {
    const creditoNum = parseFloat(inputs.credito) || 0;
    const adesaoNum = parseFloat(inputs.adesao) || 0;
    const entradaNum = parseFloat(inputs.entrada) || 0;
    const parcelaCheiaNum = parseFloat(inputs.parcelaCheia) || 0;
    const prazoNum = parseFloat(inputs.prazo) || 0;
    const parcelasEmbutidasNum = parseInt(inputs.parcelasEmbutidas) || 0;
    const parcelaReduzidaNum = parseInt(inputs.parcelaReduzida) || 0;

    let entradaCalc = adesaoNum + parcelaCheiaNum;

    if (parcelasEmbutidasNum > 0) {
      entradaCalc += parcelaCheiaNum * parcelasEmbutidasNum;
    }

    // Atualiza o campo de entrada se houver divergência

    const entradaCalcStr = entradaCalc.toFixed(2);

    // Atualiza o campo de entrada se houver divergência
    if (inputs.entrada !== entradaCalcStr) {
      const parcelaReduzidaCal = (parcelaCheiaNum * 0.7).toFixed(2);

      setInputs((prev) => ({ ...prev, parcelaReduzida: parcelaReduzidaCal }));

      setInputs((prev) => ({ ...prev, entrada: entradaCalcStr }));
    }

    if (prazoNum <= 0) {
      setComputed({ valorPago: "", jurosPagos: "" });
      return;
    }

    // Cálculo simples:
    // valorPago = (parcelaCheia * prazo) + adesao + entrada
    // jurosPagos = valorPago - credito
    const valorPagoCalc = parcelaCheiaNum * prazoNum + adesaoNum + entradaNum;
    const jurosCalc = valorPagoCalc - creditoNum;

    setComputed({
      valorPago: valorPagoCalc > 0 ? valorPagoCalc.toFixed(2) : "",
      jurosPagos: jurosCalc > 0 ? jurosCalc.toFixed(2) : "",
    });

    // Atualização automática da renda exigida: 2 vezes a parcela cheia (ou outro cálculo que desejar)
    const newRenda = (parcelaCheiaNum * 3).toFixed(2);
    if (inputs.rendaExigida !== newRenda) {
      setInputs((prev) => ({ ...prev, rendaExigida: newRenda }));
    }

    // Atualização automática do valor de cartório se necessário (ex.: 10% do crédito)
    // Caso o consórcio não use essa regra, remova ou ajuste.
  }, [
    inputs.credito,
    inputs.adesao,
    inputs.entrada,
    inputs.parcelasEmbutidas,
    inputs.parcelaCheia,
    inputs.parcelaReduzida,
    inputs.prazo,
  ]);

  // Notifica o componente pai sempre que os dados (inputs ou computed) mudam
  useEffect(() => {
    onChange(data.id, { ...inputs, ...computed });
  }, [inputs, computed]);

  return (
    <div className="bg-lamaSkyLight p-4 rounded shadow space-y-4">
      {/* Cabeçalho do Card */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">
          Consórcio #{data.id}
        </span>
        <button
          onClick={() => onDelete(data.id)}
          className="text-red-500 hover:text-red-600 text-sm"
        >
          Excluir
        </button>
      </div>

      {/* Layout em duas colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Coluna 1 */}
        <div className="space-y-4">
          {/* Título */}
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
          {/* Banco */}
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
          {/* Crédito */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Crédito
            </label>
            <NumericFormat
              value={inputs.credito}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              prefix="R$ "
              onValueChange={({ floatValue }) =>
                handleFieldChange("credito", floatValue?.toString() || "")
              }
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>
          {/* Adesão */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Adesão
            </label>
            <NumericFormat
              value={inputs.adesao}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              prefix="R$ "
              onValueChange={({ floatValue }) =>
                handleFieldChange("adesao", floatValue?.toString() || "")
              }
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>
          {/* Parcela Cheia */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Parcela Cheia
            </label>
            <NumericFormat
              value={inputs.parcelaCheia}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              prefix="R$ "
              onValueChange={({ floatValue }) =>
                handleFieldChange("parcelaCheia", floatValue?.toString() || "")
              }
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>
          {/* Parcela Reduzida */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Parcela Reduzida
            </label>
            <NumericFormat
              value={inputs.parcelaReduzida}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              prefix="R$ "
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>
          {/* Entrada */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Entrada
            </label>
            <NumericFormat
              value={inputs.entrada}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              readOnly
              fixedDecimalScale
              prefix="R$ "
              onValueChange={({ floatValue }) =>
                handleFieldChange("entrada", floatValue?.toString() || "")
              }
              className="flex-1 border border-gray-300 rounded p-2 bg-gray-50"
            />
          </div>

          {/* Embutir Parcelas */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Embutir Parcelas
            </label>
            <select
              value={inputs.parcelasEmbutidas}
              onChange={(e) =>
                handleFieldChange("parcelasEmbutidas", e.target.value)
              }
              className="flex-1 border border-gray-300 rounded p-2"
            >
              {[...Array(10)].map((_, i) => (
                <option
                  key={i}
                  value={i}
                >
                  Embutir {i}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Coluna 2 */}
        <div className="space-y-4">
          {/* Lance */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Lance
            </label>
            <NumericFormat
              value={inputs.lance}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              prefix="R$ "
              onValueChange={({ floatValue }) =>
                handleFieldChange("lance", floatValue?.toString() || "")
              }
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>
          {/* Prazo */}
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
          {/* Crédito Pós-Contemplação */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Crédito Pós-Contemplação
            </label>
            <NumericFormat
              value={inputs.creditoPosContemplacao}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              prefix="R$ "
              onValueChange={({ floatValue }) =>
                handleFieldChange(
                  "creditoPosContemplacao",
                  floatValue?.toString() || ""
                )
              }
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>
          {/* Renda Exigida */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Renda Exigida
            </label>
            <NumericFormat
              value={inputs.rendaExigida}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              prefix="R$ "
              onValueChange={({ floatValue }) =>
                handleFieldChange("rendaExigida", floatValue?.toString() || "")
              }
              className="flex-1 border border-gray-300 rounded p-2"
            />
          </div>

          {/* Valor Pago */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Valor Total Pago
            </label>
            <NumericFormat
              value={computed.valorPago}
              readOnly
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              prefix="R$ "
              className="flex-1 border border-gray-300 rounded p-2 bg-gray-50"
            />
          </div>
          {/* Juros Pagos */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm text-gray-500">
              Taxas Pagas
            </label>
            <NumericFormat
              value={computed.jurosPagos}
              readOnly
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              prefix="R$ "
              className="flex-1 border border-gray-300 rounded p-2 bg-gray-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
