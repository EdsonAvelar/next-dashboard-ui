"use client";

import Image from "next/image";

export default function CabecalhoFechamento({ fechamento }: { fechamento: any }) {
  // Aqui, espera-se que o objeto fechamento contenha as informações necessárias.
  // Ajuste os nomes conforme sua estrutura.
  const vendedor = fechamento?.primeiro_vendedor_name || "Vendedor";
  const data = fechamento?.data_fechamento
    ? new Date(fechamento.data_fechamento).toLocaleDateString("pt-BR")
    : "27/02/2025";
  const contrato = fechamento?.numero_contrato || "960066744";
  const grupo = fechamento?.grupo || "";
  const cota = fechamento?.cota || "";

  return (
    <div className="header-section  p-4 border-b-2 border-black">
      <div className="flex items-center">
        <div className="empresa-logo mr-4">
          <Image
            src="/images/empresa/logos/empresa_logo_transparente.png"
            alt="Logo"
            width={100}
            height={100}
          />
        </div>
        <div className="header-content flex-1 text-center">
          <h1 className="text-2xl font-bold">
            FICHA CADASTRAL - QUALIFICAÇÃO DO CONSORCIADO
          </h1>
          <p className="mt-2">GRUPO JLA – 43617280000194</p>
          <table className="w-full mt-4">
            <tbody>
              <tr>
                <td className="text-left font-semibold">VENDEDOR(A):</td>
                <td className="text-left">{vendedor}</td>
                <td className="text-left font-semibold">DATA:</td>
                <td className="text-left">{data}</td>
              </tr>
              <tr>
                <td className="text-left font-semibold">CONTRATO:</td>
                <td className="text-left">{contrato}</td>
                <td className="text-left font-semibold">GRUPO:</td>
                <td className="text-left">{grupo}</td>
                <td className="text-left font-semibold">COTA:</td>
                <td className="text-left">{cota}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
