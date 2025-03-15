"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";
import SelectInput from "../SelectInput";
import { fechamentoSchema, FechamentoSchema } from "@/lib/formValidationSchema";
import { updateFechamento } from "@/lib/actions";
import dayjs from "@/lib/dayjs";
import CabecalhoFechamento from "../CabecalhoFechamento";

export const ModoFechamentoOptions = [
  { value: "VENDEDOR_PRINCIPAL", label: "Vendedor Principal" },
  { value: "MODO_AJUDA", label: "Modo Ajuda" },
  { value: "TELEMARKETING", label: "Telemarketing" },
  { value: "OUTROS", label: "Outros" },
];

type FechamentoFormProps = {
  fechamento: any;
  relatedData: any;
  vendedores: any;
};

export const VendaStatusOptions = [
  { value: "RASCUNHO", label: "RASCUNHO" },
  { value: "FECHADA", label: "FECHADA" },
  { value: "CANCELADA", label: "CANCELADA" },
];

export const EstadoCivilOptions = [
  { value: "SOLTEIRO", label: "SOLTEIRO" },
  { value: "CASADO", label: "CASADO" },
  { value: "DIVORCIADO", label: "DIVORCIADO" },
  { value: "VIUVO", label: "VIUVO" },
  { value: "SEPARADO", label: "SEPARADO" },
  { value: "UNIAO_ESTAVEL", label: "UNIAO ESTAVEL" },
  { value: "OUTRO", label: "OUTRO" },
];

export const GeneroOptions = [
  { value: "MASCULINO", label: "MASCULINO" },
  { value: "FEMININO", label: "FEMININO" },
  { value: "OUTRO", label: "OUTRO" },
];

export default function FechamentoForm({
  fechamento,
  relatedData,
  vendedores,
}: FechamentoFormProps) {
  const router = useRouter();

  // Conversão dos campos de data para string (YYYY-MM-DD)
  const formatDate = (date: any) =>
    date ? dayjs(date).format("YYYY-MM-DD") : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FechamentoSchema>({
    resolver: zodResolver(fechamentoSchema),
    defaultValues: {
      negocio_id: fechamento.negocioId.toString(),
      data_fechamento: fechamento.data_fechamento
        ? formatDate(fechamento.data_fechamento)
        : "",
      status: fechamento.status || "",
      grupo: fechamento.grupo ? fechamento.grupo.toString() : "",
      cota: fechamento.cota ? fechamento.cota.toString() : "",
      especie: fechamento.especie || "",
      marca: fechamento.marca || "",
      modelo: fechamento.modelo || "",
      tipo_plano: fechamento.tipo_plano || "",
      plano_leve: fechamento.plano_leve || "",
      seguro_prestamista: fechamento.seguro_prestamista || "",
      codigo_bem: fechamento.codigo_bem || "",
      preco_bem: fechamento.preco_bem ? fechamento.preco_bem.toString() : "",
      duracao_grupo: fechamento.duracao_grupo
        ? fechamento.duracao_grupo.toString()
        : "",
      duracao_plano: fechamento.duracao_plano
        ? fechamento.duracao_plano.toString()
        : "",
      grupo_em_formacao: fechamento.grupo_em_formacao ? "SIM" : "NÃO",
      numero_assembleia_adesao: fechamento.numero_assembleia_adesao
        ? fechamento.numero_assembleia_adesao.toString()
        : "",
      data_assembleia: fechamento.data_assembleia
        ? formatDate(fechamento.data_assembleia)
        : "",
      pagamento_incorporado: fechamento.pagamento_incorporado
        ? fechamento.pagamento_incorporado.toString()
        : "",
      pagamento_ate_contemplacao: fechamento.pagamento_ate_contemplacao
        ? fechamento.pagamento_ate_contemplacao.toString()
        : "",
      numero_contrato: fechamento.numero_contrato
        ? fechamento.numero_contrato.toString()
        : "",
      parcela: fechamento.parcela ? fechamento.parcela.toString() : "",
      parcela_antecipada: fechamento.parcela_antecipada
        ? fechamento.parcela_antecipada.toString()
        : "",
      total_antecipado: fechamento.total_antecipado
        ? fechamento.total_antecipado.toString()
        : "",
      adesao: fechamento.adesao ? fechamento.adesao.toString() : "",
      primeira_parcela: fechamento.primeira_parcela
        ? fechamento.primeira_parcela.toString()
        : "",
      total_pago: fechamento.total_pago ? fechamento.total_pago.toString() : "",
      forma_pagamento: fechamento.forma_pagamento || "",
      comentarios: fechamento.comentarios || "",
      tabela: fechamento.tabela ? "1" : "0",
      vendedores:
        fechamento.vendedores?.map((v: any) => ({
          userId: v.userId ? v.userId.toString() : "",
          modo: v.modo || "OUTROS",
          comissao: v.comissao ? v.comissao.toString() : "",
          confirmed: true,
        })) || [],
      // Dados do Consorciado
      consorciado: {
        nome: fechamento.negocio?.consorciado?.nome || "",
        nome_pai: fechamento.negocio?.consorciado?.nome_pai || "",
        nome_mae: fechamento.negocio?.consorciado?.nome_mae || "",

        data_nasc: fechamento.negocio?.consorciado?.data_nasc
          ? formatDate(fechamento.negocio.consorciado.data_nasc)
          : "",
        cpf: fechamento.negocio?.consorciado?.cpf || "",
        rg: fechamento.negocio?.consorciado?.rg || "",
        orgao_exp: fechamento.negocio?.consorciado?.orgao_exp || "",
        data_exp: fechamento.negocio?.consorciado?.data_exp
          ? formatDate(fechamento.negocio.consorciado.data_exp)
          : "",
        estado_civil: fechamento.negocio?.consorciado?.estado_civil || "",
        genero: fechamento.negocio?.consorciado?.genero || "",
        nacionalidade: fechamento.negocio?.consorciado?.nacionalidade || "",
        naturalidade: fechamento.negocio?.consorciado?.naturalidade || "",
        formacao: fechamento.negocio?.consorciado?.formacao || "",
        profissao: fechamento.negocio?.consorciado?.profissao || "",
        renda_liquida: fechamento.negocio?.consorciado?.renda_liquida || "",
        endereco: fechamento.negocio?.consorciado?.endereco || "",
        numero: fechamento.negocio?.consorciado?.numero || "",
        complemento: fechamento.negocio?.consorciado?.complemento || "",
        bairro: fechamento.negocio?.consorciado?.bairro || "",
        cidade: fechamento.negocio?.consorciado?.cidade || "",
        estado: fechamento.negocio?.consorciado?.estado || "",
        cep: fechamento.negocio?.consorciado?.cep || "",
        telefone: fechamento.negocio?.consorciado?.telefone || "",
        whatsapp: fechamento.negocio?.consorciado?.whatsapp || "",
        email: fechamento.negocio?.consorciado?.email || "",
      },
      // Dados do Cônjuge
      conjuge: {
        nome: fechamento.negocio?.conjuge?.nome || "",
        data_nasc: fechamento.negocio?.conjuge?.data_nasc
          ? formatDate(fechamento.negocio?.conjuge.data_nasc)
          : "",
        cpf: fechamento.negocio?.conjuge?.cpf || "",
        rg: fechamento.negocio?.conjuge?.rg || "",
        orgao_exp: fechamento.negocio?.conjuge?.orgao_exp || "",
        estado_civil: fechamento.negocio?.conjuge?.estado_civil || "",
        genero: fechamento.negocio?.conjuge?.genero || "",
        nacionalidade: fechamento.negocio?.conjuge?.nacionalidade || "",
        naturalidade: fechamento.negocio?.conjuge?.naturalidade || "",
        formacao: fechamento.negocio?.conjuge?.formacao || "",
        profissao: fechamento.negocio?.conjuge?.profissao || "",
        renda_liquida: fechamento.negocio?.conjuge?.renda_liquida || "",
        endereco: fechamento.negocio?.conjuge?.endereco || "",
        numero: fechamento.negocio?.conjuge?.numero || "",
        complemento: fechamento.negocio?.conjuge?.complemento || "",
        bairro: fechamento.negocio?.conjuge?.bairro || "",
        cidade: fechamento.negocio?.conjuge?.cidade || "",
        estado: fechamento.negocio?.conjuge?.estado || "",
        cep: fechamento.negocio?.conjuge?.cep || "",
      },
    },
  });

  const [submitState, setSubmitState] = useState({ success: false, msg: "" });

  const onSubmit = handleSubmit(
    async (data) => {
      console.log("Submit", data);
      const result = await updateFechamento(data);
      setSubmitState(result);
    },
    (errors) => {
      console.log("Validation Errors:", errors);
    }
  );

  useEffect(() => {
    if (submitState.msg) {
      if (submitState.success) {
        toast.success(submitState.msg);
        router.refresh();
      } else {
        toast.error(submitState.msg);
      }
    }
  }, [submitState, router]);

  // Atualiza o formulário caso o objeto 'fechamento' mude
  useEffect(() => {
    reset({
      negocio_id: fechamento.negocioId.toString(),
      data_fechamento: fechamento.data_fechamento
        ? formatDate(fechamento.data_fechamento)
        : "",
      status: fechamento.status || "",
      vendedores:
        fechamento.vendedores?.map((v: any) => ({
          userId: v.userId ? v.userId.toString() : "",
          modo: v.modo || "OUTROS",
          comissao: v.comissao ? v.comissao.toString() : "",
          confirmed: true,
        })) || [],
      consorciado: {
        nome: fechamento.negocio?.consorciado?.nome || "",
        nome_pai: fechamento.negocio?.consorciado?.nome_pai || "",
        nome_mae: fechamento.negocio?.consorciado?.nome_mae || "",
        data_nasc: fechamento.negocio?.consorciado?.data_nasc
          ? formatDate(fechamento.negocio.consorciado.data_nasc)
          : "",
        cpf: fechamento.negocio?.consorciado?.cpf || "",
        rg: fechamento.negocio?.consorciado?.rg || "",
        orgao_exp: fechamento.negocio?.consorciado?.orgao_exp || "",
        data_exp: fechamento.negocio?.consorciado?.data_exp
          ? formatDate(fechamento.negocio.consorciado.data_exp)
          : "",
        estado_civil: fechamento.negocio?.consorciado?.estado_civil || "",
        genero: fechamento.negocio?.consorciado?.genero || "",
        nacionalidade: fechamento.negocio?.consorciado?.nacionalidade || "",
        naturalidade: fechamento.negocio?.consorciado?.naturalidade || "",
        formacao: fechamento.negocio?.consorciado?.formacao || "",
        profissao: fechamento.negocio?.consorciado?.profissao || "",
        renda_liquida: fechamento.negocio?.consorciado?.renda_liquida || "",
        endereco: fechamento.negocio?.consorciado?.endereco || "",
        numero: fechamento.negocio?.consorciado?.numero || "",
        complemento: fechamento.negocio?.consorciado?.complemento || "",
        bairro: fechamento.negocio?.consorciado?.bairro || "",
        cidade: fechamento.negocio?.consorciado?.cidade || "",
        estado: fechamento.negocio?.consorciado?.estado || "",
        cep: fechamento.negocio?.consorciado?.cep || "",
        telefone: fechamento.negocio?.consorciado?.telefone || "",
        whatsapp: fechamento.negocio?.consorciado?.whatsapp || "",
        email: fechamento.negocio?.consorciado?.email || "",
      },
      conjuge: {
        nome: fechamento.negocio?.conjuge?.nome || "",
        data_nasc: fechamento.negocio?.conjuge?.data_nasc
          ? formatDate(fechamento.negocio?.conjuge.data_nasc)
          : "",
        cpf: fechamento.negocio?.conjuge?.cpf || "",
        rg: fechamento.negocio?.conjuge?.rg || "",
        orgao_exp: fechamento.negocio?.conjuge?.orgao_exp || "",
        estado_civil: fechamento.negocio?.conjuge?.estado_civil || "",
        genero: fechamento.negocio?.conjuge?.genero || "",
        nacionalidade: fechamento.negocio?.conjuge?.nacionalidade || "",
        naturalidade: fechamento.negocio?.conjuge?.naturalidade || "",
        formacao: fechamento.negocio?.conjuge?.formacao || "",
        profissao: fechamento.negocio?.conjuge?.profissao || "",
        renda_liquida: fechamento.negocio?.conjuge?.renda_liquida || "",
        endereco: fechamento.negocio?.conjuge?.endereco || "",
        numero: fechamento.negocio?.conjuge?.numero || "",
        complemento: fechamento.negocio?.conjuge?.complemento || "",
        bairro: fechamento.negocio?.conjuge?.bairro || "",
        cidade: fechamento.negocio?.conjuge?.cidade || "",
        estado: fechamento.negocio?.conjuge?.estado || "",
        cep: fechamento.negocio?.conjuge?.cep || "",
      },
    });
  }, [fechamento, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vendedores",
  });

  const [showConjuge, setShowConjuge] = useState(false);

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8"
    >
      <CabecalhoFechamento fechamento={fechamento} />

      {/* Seção: Informações Pessoais do Consorciado */}
      <div className="p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold bg-slate-600 text-white py-3 px-2 mb-4 rounded-md uppercase">
          Informações Pessoais Consorciado
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-4 gap-2">
          <div className="col-span-2">
            <InputField
              label="Nome do Consorciado Completo"
              name="consorciado.nome"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.nome}
            />
          </div>
          <div className="col-span-2">
            <InputField
              label="Nome do Pai"
              name="consorciado.nome_pai"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.nome_pai}
            />
          </div>
          <div className="col-span-2">
            <InputField
              label="Nome da Mãe"
              name="consorciado.nome_mae"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.nome_mae}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Data de Nascimento"
              type="date"
              name="consorciado.data_nasc"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.data_nasc}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="CPF"
              type="text"
              name="consorciado.cpf"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.cpf}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="RG"
              type="text"
              name="consorciado.rg"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.rg}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Órgão Expedidor"
              type="text"
              name="consorciado.orgao_exp"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.orgao_exp}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Data de Expedição"
              type="date"
              name="consorciado.data_exp"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.data_exp}
            />
          </div>
          <div className="col-span-1">
            <SelectInput
              label="Estado Civil"
              name="consorciado.estado_civil"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.estado_civil}
              options={EstadoCivilOptions}
            />
          </div>
          <div className="col-span-1">
            <SelectInput
              label="Gênero"
              name="consorciado.genero"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.genero}
              options={GeneroOptions}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Nacionalidade"
              type="text"
              name="consorciado.nacionalidade"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.nacionalidade}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Naturalidade"
              type="text"
              name="consorciado.naturalidade"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.naturalidade}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Formação"
              type="text"
              name="consorciado.formacao"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.formacao}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Profissão/Cargo"
              type="text"
              name="consorciado.profissao"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.profissao}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Renda Líquida Mensal"
              type="text"
              name="consorciado.renda_liquida"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.renda_liquida}
            />
          </div>
        </div>
      </div>

      {/* Seção: Informações do Cônjuge */}
      <div className="p-4 rounded shadow">
        <div className="flex items-center gap-2 bg-slate-600 text-white py-3 px-2 mb-4 rounded-md uppercase ">
          <h2 className="text-xl font-semibold">
            Informações Pessoais do Cônjuge
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-4 gap-2">
          <div className="col-span-2">
            <InputField
              label={fechamento.negocio?.conjuge?.nome}
              type="text"
              name="conjuge.nome"
              register={register}
              defaultValue={fechamento.negocio?.conjuge?.nome}
            />
          </div>

          <div className="col-span-1">
            <InputField
              label="Data de Nascimento"
              type="date"
              name="conjuge.data_nasc"
              register={register}
              defaultValue={fechamento.negocio?.conjuge?.data_nasc}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="CPF"
              name="conjuge.cpf"
              register={register}
              defaultValue={fechamento.negocio?.conjuge?.cpf}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="RG"
              name="conjuge.rg"
              register={register}
              defaultValue={fechamento.negocio?.conjuge?.rg}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Órgão Expedidor"
              name="conjuge.orgao_exp"
              register={register}
              defaultValue={fechamento.negocio?.conjuge?.orgao_exp}
            />
          </div>
          <div className="col-span-1">
            <SelectInput
              label="Gênero"
              name="conjuge.genero"
              register={register}
              defaultValue={fechamento.negocio?.conjuge?.genero}
              options={GeneroOptions}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Nacionalidade"
              type="text"
              name="conjuge.nacionalidade"
              register={register}
              defaultValue={fechamento.negocio?.conjuge?.nacionalidade}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Naturalidade"
              type="text"
              name="conjuge.naturalidade"
              register={register}
              defaultValue={fechamento.negocio?.conjuge?.naturalidade}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Formação"
              type="text"
              name="conjuge.formacao"
              register={register}
              defaultValue={fechamento.negocio?.conjuge?.formacao}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Profissão/Cargo"
              type="text"
              name="conjuge.profissao"
              register={register}
              defaultValue={fechamento.negocio?.conjuge?.profissao}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Renda Líquida Mensal"
              type="text"
              name="conjuge.renda_liquida"
              register={register}
              defaultValue={fechamento.negocio?.conjuge?.renda_liquida}
            />
          </div>
        </div>
      </div>

      {/* Seção: Endereço Residencial */}
      <div className="p-4 rounded shadow">
        <h2 className="text-xl font-semibold bg-slate-600 text-white py-3 px-2 mb-4 rounded-md uppercase">
          Endereço Residencial
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-4 gap-2">
          <div className="col-span-1">
            <InputField
              label="CEP"
              name="consorciado.cep"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.cep}
            />
          </div>
          <div className="col-span-2">
            <InputField
              label="Rua/Av"
              name="consorciado.endereco"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.endereco}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Número"
              name="consorciado.numero"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.numero}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Complemento"
              name="consorciado.complemento"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.complemento}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Bairro"
              name="consorciado.bairro"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.bairro}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Cidade"
              name="consorciado.cidade"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.cidade}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Estado"
              name="consorciado.estado"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.estado}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Telefone 1"
              name="consorciado.telefone"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.telefone}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="WhatsApp"
              name="consorciado.whatsapp"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.whatsapp}
            />
          </div>
          <div className="col-span-2">
            <InputField
              label="Email"
              name="consorciado.email"
              register={register}
              defaultValue={fechamento.negocio?.consorciado?.email}
            />
          </div>
        </div>
      </div>

      {/* Seção: Dados do Plano Contratado */}
      <div className="p-4 rounded shadow">
        <h2 className="text-xl font-semibold bg-slate-600 text-white py-3 px-2 mb-4 rounded-md uppercase">
          Dados do Plano Contratado
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="col-span-1">
            <InputField
              label="Grupo"
              name="grupo"
              register={register}
              defaultValue={fechamento.grupo?.toString() || ""}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Cota"
              name="cota"
              register={register}
              defaultValue={fechamento.cota?.toString() || ""}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Espécie"
              name="especie"
              register={register}
              defaultValue={fechamento.especie || ""}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Marca"
              name="marca"
              register={register}
              defaultValue={fechamento.marca || ""}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Modelo"
              name="modelo"
              register={register}
              defaultValue={fechamento.modelo || ""}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Código do Bem"
              name="codigo_bem"
              register={register}
              defaultValue={fechamento.codigo_bem || ""}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Duração do Grupo (meses)"
              name="duracao_grupo"
              register={register}
              defaultValue={
                fechamento.duracao_grupo
                  ? fechamento.duracao_grupo.toString()
                  : ""
              }
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Duração do Plano (meses)"
              name="duracao_plano"
              register={register}
              defaultValue={
                fechamento.duracao_plano
                  ? fechamento.duracao_plano.toString()
                  : ""
              }
            />
          </div>
          <div className="col-span-1">
            <SelectInput
              label="Grupo em Formação"
              name="grupo_em_formacao"
              register={register}
              defaultValue={fechamento.grupo_em_formacao ? "SIM" : "NÃO"}
              options={[
                { value: "SIM", label: "SIM" },
                { value: "NÃO", label: "NÃO" },
              ]}
            />
          </div>
          <div className="col-span-1">
            <SelectInput
              label="Grupo em Andamento"
              name="grupo_em_andamento"
              register={register}
              defaultValue={fechamento.grupo_em_andamento ? "1" : "0"}
              options={[
                { value: "1", label: "SIM" },
                { value: "0", label: "NÃO" },
              ]}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Nº Assembleia"
              name="numero_assembleia_adesao"
              register={register}
              defaultValue={
                fechamento.numero_assembleia_adesao
                  ? fechamento.numero_assembleia_adesao.toString()
                  : ""
              }
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Data Assembleia"
              name="data_assembleia"
              register={register}
              defaultValue={
                fechamento.data_assembleia
                  ? formatDate(fechamento.data_assembleia)
                  : ""
              }
              type="date"
            />
          </div>

          <div className="col-span-1">
            <InputField
              label="Pagamento Incorporado"
              name="pagamento_incorporado"
              register={register}
              defaultValue={
                fechamento.pagamento_incorporado
                  ? fechamento.pagamento_incorporado.toString()
                  : ""
              }
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Pagamento até Contemplação"
              name="pagamento_ate_contemplacao"
              register={register}
              defaultValue={
                fechamento.pagamento_ate_contemplacao
                  ? fechamento.pagamento_ate_contemplacao.toString()
                  : ""
              }
            />
          </div>
          <div className="col-span-1">
            <SelectInput
              label="Tabela"
              name="tabela"
              register={register}
              defaultValue={fechamento.tabela ? "1" : "0"}
              options={[
                { value: "1", label: "CIMA" },
                { value: "0", label: "BAIXO" },
              ]}
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Número Contrato"
              name="numero_contrato"
              register={register}
              defaultValue={
                fechamento.numero_contrato
                  ? fechamento.numero_contrato.toString()
                  : ""
              }
            />
          </div>
        </div>
      </div>

      {/* Seção: Dados Financeiros */}
      <div className="p-4 rounded shadow">
        <h2 className="text-xl font-semibold bg-slate-600 text-white py-3 px-2 mb-4 rounded-md uppercase">
          Dados Financeiros
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="col-span-1">
            <InputField
              label="Parcela"
              name="parcela"
              register={register}
              defaultValue={
                fechamento.parcela ? fechamento.parcela.toString() : ""
              }
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Parcelas Antecipadas"
              name="parcela_antecipada"
              register={register}
              defaultValue={
                fechamento.parcela_antecipada
                  ? fechamento.parcela_antecipada.toString()
                  : ""
              }
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Total Antecipado"
              name="total_antecipado"
              register={register}
              defaultValue={
                fechamento.total_antecipado
                  ? fechamento.total_antecipado.toString()
                  : ""
              }
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Adesão"
              name="adesao"
              register={register}
              defaultValue={
                fechamento.adesao ? fechamento.adesao.toString() : ""
              }
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Primeira Parcela"
              name="primeira_parcela"
              register={register}
              defaultValue={
                fechamento.primeira_parcela
                  ? fechamento.primeira_parcela.toString()
                  : ""
              }
            />
          </div>
          <div className="col-span-1">
            <InputField
              label="Total Pago"
              name="total_pago"
              register={register}
              defaultValue={
                fechamento.total_pago ? fechamento.total_pago.toString() : ""
              }
            />
          </div>
        </div>
      </div>

      {/* Seção: Informações do Comercial */}
      <div className="bg-green-100 p-4 rounded shadow mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold uppercase">
            Informações do Comercial
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 mb-5 px-1">
          <div className="col-span-1">
            <InputField
              label="Data Fechamento"
              name="data_fechamento"
              register={register}
              error={errors?.data_fechamento}
              isRequired={true}
              defaultValue={
                fechamento.data_fechamento
                  ? formatDate(fechamento.data_fechamento)
                  : dayjs().format("YYYY-MM-DD")
              }
              type="date"
            />
          </div>

          <div className="col-span-1">
            <InputField
              label="Valor Crédito"
              name="preco_bem"
              isRequired={true}
              register={register}
              defaultValue={
                fechamento.preco_bem ? fechamento.preco_bem.toString() : ""
              }
            />
          </div>
        </div>

        <div className="overflow-x-auto px-4">
          <button
            type="button"
            onClick={() => append({ userId: "", modo: "", comissao: "" })}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors mb-3"
          >
            Adicionar Vendedor
          </button>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Nome
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Papel
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Comissão
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="px-4 py-2">
                    <select
                      {...register(`vendedores.${index}.userId`)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Selecione um usuário</option>
                      {vendedores.map((user: any) => (
                        <option
                          key={user.id}
                          value={user.id}
                        >
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      {...register(`vendedores.${index}.modo`)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Selecione</option>
                      {ModoFechamentoOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      placeholder="Comissão"
                      {...register(`vendedores.${index}.comissao`)}
                      className="w-full p-2 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-colors"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
              {fields.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-2 text-center text-gray-500"
                  >
                    Nenhum vendedor associado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botões */}
      <div className="flex flex-col md:flex-row justify-end items-center mt-6 space-y-2 md:space-y-0 md:space-x-4">
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
        >
          Gerar Protocolo
        </button>

        <SelectInput
          name="status"
          register={register}
          defaultValue={fechamento.status || ""}
          options={VendaStatusOptions}
        />
      </div>
    </form>
  );
}
