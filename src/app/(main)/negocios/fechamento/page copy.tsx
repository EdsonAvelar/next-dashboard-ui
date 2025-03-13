// app/fechamento/page.tsx
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

// Função auxiliar para formatar datas (formato DD/MM/YYYY)
function toData(date: Date | string): string {
  try {
    return dayjs(date).format("DD/MM/YYYY");
  } catch (error) {
    return "";
  }
}

export default async function FechamentoPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  // Supondo que o id do negócio seja passado via query string como negocioId
  const negocioId = searchParams?.negocioId;
  if (!negocioId) {
    return <div>ID do negócio não fornecido.</div>;
  }

  // Busca o fechamento associado ao negócio, com os relacionamentos necessários
  const fechamento = await prisma.fechamento.findFirst({
    where: { negocioId: parseInt(negocioId, 10) },
    include: {
      negocio: {
        include: {
          consorciado: true,
          conjuge: true,
        },
      },
    },
  });

  if (!fechamento) {
    return <div>Fechamento não encontrado para o negócio {negocioId}</div>;
  }

  const negocio = fechamento.negocio;

  return (
    <div className="container mx-auto p-4">
      {/* HEADER */}
      <div className="header-section flex flex-col md:flex-row items-center border-b-2 border-black p-4 bg-white">
        <div className="md:w-1/4 flex justify-center mb-4 md:mb-0">
          <Image
            src="/images/empresa/logos/empresa_logo_transparente.png"
            alt="Logo da Empresa"
            width={100}
            height={100}
          />
        </div>
        <div className="md:w-1/2 text-center">
          <h1 className="text-2xl font-bold">
            FICHA CADASTRAL - QUALIFICAÇÃO DO CONSORCIADO
          </h1>
          <p className="mt-2">
            {process.env.NEXT_PUBLIC_EMPRESA_NOME?.toUpperCase()} –{" "}
            {process.env.NEXT_PUBLIC_EMPRESA_CNPJ}
          </p>
          <table className="w-full mt-2">
            <tbody>
              <tr className="flex justify-between">
                <td className="flex-1">
                  <strong>VENDEDOR(A):</strong>{" "}
                  {fechamento.negocio?.consorciado?.nome || "N/A"}
                </td>
                <td className="flex-1">
                  <strong>DATA:</strong>{" "}
                  {fechamento.data_fechamento
                    ? toData(fechamento.data_fechamento)
                    : ""}
                </td>
              </tr>
              <tr className="flex justify-between">
                <td className="flex-1">
                  <strong>CONTRATO:</strong> {fechamento.numero_contrato || ""}
                </td>
                <td className="flex-1">
                  <strong>GRUPO:</strong> {fechamento.grupo || ""}
                </td>
                <td className="flex-1">
                  <strong>COTA:</strong> {fechamento.cota || ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="md:w-1/4 text-center">
          <button
            onClick={() => window.print()}
            className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded"
          >
            Imprimir
          </button>
        </div>
      </div>

      {/* FORMULÁRIO */}
      <div className="mt-6 bg-white p-6 rounded shadow">
        <form
          action="/api/fechamento"
          method="POST"
        >
          {/* Campo oculto com o id do negócio */}
          <input
            type="hidden"
            name="negocio_id"
            value={negocioId}
          />

          {/* Seção: Informações Pessoais */}
          <h5 className="mb-3 text-xl font-bold bg-blue-200 p-2">
            Informações Pessoais
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">NOME COMPLETO</label>
              <input
                type="text"
                name="nome"
                defaultValue={negocio.consorciado?.nome || ""}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">DATA DE NASCIMENTO</label>
              <input
                type="text"
                name="data_nasc"
                defaultValue={
                  negocio.consorciado?.data_nasc
                    ? toData(negocio.consorciado.data_nasc)
                    : ""
                }
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Seção: Informações Pessoais do Cônjuge */}
          <h5 className="mt-6 mb-3 text-xl font-bold bg-blue-200 p-2">
            Informações Pessoais do Cônjuge
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">NOME COMPLETO</label>
              <input
                type="text"
                name="conj_nome"
                defaultValue={negocio.conjuge?.nome || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">DATA DE NASCIMENTO</label>
              <input
                type="text"
                name="conj_data_nasc"
                defaultValue={
                  negocio.conjuge?.data_nasc
                    ? toData(negocio.conjuge.data_nasc)
                    : ""
                }
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Seção: Endereço Residencial */}
          <h5 className="mt-6 mb-3 text-xl font-bold bg-blue-200 p-2">
            Endereço Residencial
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold">CEP</label>
              <input
                type="text"
                name="cep"
                defaultValue={negocio.consorciado?.cep || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold">RUA/AV</label>
              <input
                type="text"
                name="endereco"
                defaultValue={negocio.consorciado?.endereco || ""}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block font-semibold">NÚMERO</label>
              <input
                type="text"
                name="numero"
                defaultValue={`{negocio.consorciado?.numero}`}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">BAIRRO</label>
              <input
                type="text"
                name="bairro"
                defaultValue={negocio.consorciado?.bairro || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">CIDADE</label>
              <input
                type="text"
                name="cidade"
                defaultValue={negocio.consorciado?.cidade || ""}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block font-semibold">ESTADO</label>
              <input
                type="text"
                name="estado"
                defaultValue={negocio.consorciado?.estado || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">TEL 1</label>
              <input
                type="text"
                name="telefone"
                defaultValue={negocio.consorciado?.telefone || ""}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">TEL 2</label>
              <input
                type="text"
                name="conf_telefone"
                defaultValue={negocio.conjuge?.telefone || ""}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 mt-4">
            <div>
              <label className="block font-semibold">EMAIL</label>
              <input
                type="text"
                name="email"
                defaultValue={negocio.consorciado?.email || ""}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Seção: Dados do Plano Contratado */}
          <h5 className="mt-6 mb-3 text-xl font-bold bg-blue-200 p-2">
            Dados do Plano Contratado
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold">GRUPO</label>
              <input
                type="text"
                name="grupo"
                defaultValue={fechamento.grupo || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">COTA</label>
              <input
                type="text"
                name="cota"
                defaultValue={fechamento.cota || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">ESPÉCIE</label>
              <input
                type="text"
                name="especie"
                defaultValue={fechamento.especie || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">MARCA</label>
              <input
                type="text"
                name="marca"
                defaultValue={fechamento.marca || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">MODELO</label>
              <input
                type="text"
                name="modelo"
                defaultValue={fechamento.modelo || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">CÓDIGO DO BEM</label>
              <input
                type="text"
                name="codigo_bem"
                defaultValue={fechamento.codigo_bem || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">PREÇO DO BEM</label>
              <input
                type="text"
                name="preco_bem"
                defaultValue={`{fechamento.preco_bem}`}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">DURAÇÃO DO GRUPO</label>
              <input
                type="text"
                name="duracao_grupo"
                defaultValue={fechamento.duracao_grupo || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">DURAÇÃO DO PLANO</label>
              <input
                type="text"
                name="duracao_plano"
                defaultValue={fechamento.duracao_plano || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">TIPO DO PLANO</label>
              <input
                type="text"
                name="tipo_plano"
                defaultValue={fechamento.tipo_plano || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">PLANO LEVE (LIGHT)</label>
              <input
                type="text"
                name="plano_leve"
                defaultValue={fechamento.plano_leve || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">SEGURO PRESTAMISTA</label>
              <input
                type="text"
                name="seguro_prestamista"
                defaultValue={fechamento.seguro_prestamista || ""}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Seção: Forma de Pagamento Inicial */}
          <h5 className="mt-6 mb-3 text-xl font-bold bg-blue-200 p-2">
            Forma de Pagamento Inicial
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold">VALOR CRÉDITO</label>
              <input
                type="text"
                name="valor"
                defaultValue={`{fechamento.preco_bem}`}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">PARCELA</label>
              <input
                type="text"
                name="parcela"
                defaultValue={`{fechamento.parcela}`}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">
                PARCELAS ANTECIPADAS
              </label>
              <input
                type="text"
                name="parcela_antecipada"
                defaultValue={`{fechamento.parcela_antecipada}`}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">TOTAL ANTECIPADO</label>
              <input
                type="text"
                name="total_antecipado"
                defaultValue={`{fechamento.total_antecipado}`}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Seção: Informações do Comercial */}
          <h5 className="mt-6 mb-3 text-xl font-bold bg-success text-white p-2">
            Informações do Comercial
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Primeiro Vendedor</label>
              <select
                className="form-select"
                name="primeiro_vendedor_id"
                required
              >
                <option value="">Selecione</option>
                {/* Exemplo: mapear vendedores */}
              </select>
            </div>
            <div>
              <label className="form-label">Segundo Vendedor</label>
              <select
                className="form-select"
                name="segundo_vendedor_id"
              >
                <option value="">Selecione</option>
                {/* Exemplo: mapear vendedores */}
              </select>
            </div>
            <div>
              <label className="form-label">Terceiro Vendedor</label>
              <select
                className="form-select"
                name="terceiro_vendedor_id"
              >
                <option value="">Selecione</option>
                {/* Exemplo: mapear vendedores */}
              </select>
            </div>
          </div>

          {/* Botões */}
          <div className="mt-4 text-end">
            <button
              type="button"
              className="btn btn-info mr-2 bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => window.print()}
            >
              <i className="mdi mdi-printer"></i> Imprimir
            </button>
            <button
              type="submit"
              className="btn btn-success bg-green-500 text-white py-2 px-4 rounded"
            >
              <i className="mdi mdi-content-save"></i> Salvar
            </button>
          </div>
        </form>
      </div>

      {/* Assinatura */}
      <div className="flex justify-center mt-6">
        <div className="w-full border-t-2 border-black"></div>
      </div>
      <div className="flex flex-col items-center mt-2">
        <h4>ASSINATURA DO CONSORCIADO</h4>
        <p>{negocio.consorciado?.nome}</p>
      </div>
    </div>
  );
}
