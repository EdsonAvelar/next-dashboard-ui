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

export default function FechamentoForm({
  fechamento,
  relatedData,
  vendedores,
}: FechamentoFormProps) {
  const router = useRouter();

  // Configura o react-hook-form com os valores default do fechamento.
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<FechamentoSchema>({
    resolver: zodResolver(fechamentoSchema),
    defaultValues: {
      // Campos do fechamento
      negocio_id: fechamento.negocioId.toString(),
      data_fechamento: fechamento.data_fechamento
        ? new Date(fechamento.data_fechamento).toISOString().split("T")[0]
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
      grupo_em_formacao: fechamento.grupo_em_formacao ? "1" : "0",
      numero_assembleia_adesao: fechamento.numero_assembleia_adesao
        ? fechamento.numero_assembleia_adesao.toString()
        : "",
      data_assembleia: fechamento.data_assembleia
        ? new Date(fechamento.data_assembleia).toISOString().split("T")[0]
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
      // Esses campos (dados do consorciado e cônjuge) podem ser apenas para exibição (readOnly)
      // A ideia é enviar um objeto JSON com as comissões: { [userId]: comissao }
      vendedores:
        fechamento.vendedores?.map((v: any) => ({
          userId: v.userId ? v.userId.toString() : "",
          modo: v.modo ? v.modo : "OUTROS",
          comissao: v.comissao ? v.comissao.toString() : "",
          confirmed: true,
        })) || [],
    },
  });

  // const [state, formAction] = useFormState(updateFechamento, {
  //   success: false,
  //   msg: "",
  // });

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

  // Caso o objeto 'fechamento' mude, atualiza o formulário:
  useEffect(() => {
    reset({
      negocio_id: fechamento.negocioId.toString(),
      data_fechamento: fechamento.data_fechamento
        ? new Date(fechamento.data_fechamento).toISOString().split("T")[0]
        : "",
      status: fechamento.status || "",
      // ... mapeie os demais campos ...
      vendedores:
        fechamento.vendedores?.map((v: any) => ({
          userId: v.userId ? v.userId.toString() : "",
          role: v.role || "",
          comissao: v.comissao ? v.comissao.toString() : "",
          confirmed: true,
        })) || [],
    });
  }, [fechamento, reset]);

  // useFieldArray para gerenciar os vendedores dinamicamente
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "vendedores",
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8"
    >
      <h1 className="text-2xl font-bold mb-4">Atualizar Fechamento</h1>

      {/* Seção: Informações Pessoais do Consorciado (apenas exibição) */}
      <div className=" p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Dados do Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Nome Completo"
            name="nome"
            register={register}
            defaultValue={fechamento.negocio?.consorciado?.nome}
          />
          <InputField
            label="Data de Nascimento"
            name="data_nasc"
            register={register}
            defaultValue={fechamento.negocio?.consorciado?.data_nasc}
          />
        </div>
      </div>

      {/* Seção: Informações do Cônjuge */}
      <div className="p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">
          Dados do Cônjuge (opcional)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Nome Completo"
            name="conj_nome"
            register={register}
            defaultValue={fechamento.conjuge?.nome}
          />
          <InputField
            label="Data de Nascimento"
            name="conj_data_nasc"
            register={register}
            defaultValue={fechamento.conjuge?.data_nasc}
          />
        </div>
      </div>

      {/* Seção: Endereço Residencial */}
      <div className="p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Endereço Residencial</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="CEP"
            name="cep"
            register={register}
            defaultValue={fechamento.negocio?.consorciado?.cep}
          />
          <InputField
            label="Rua/Av"
            name="endereco"
            register={register}
            defaultValue={fechamento.negocio?.consorciado?.endereco}
          />
          <InputField
            label="Número"
            name="numero"
            register={register}
            defaultValue={fechamento.negocio?.consorciado?.numero}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <InputField
            label="Bairro"
            name="bairro"
            register={register}
            defaultValue={fechamento.negocio?.consorciado?.bairro}
          />
          <InputField
            label="Cidade"
            name="cidade"
            register={register}
            defaultValue={fechamento.negocio?.consorciado?.cidade}
          />
          <InputField
            label="Estado"
            name="estado"
            register={register}
            defaultValue={fechamento.negocio?.consorciado?.estado}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <InputField
            label="Telefone"
            name="telefone"
            register={register}
            defaultValue={fechamento.negocio?.consorciado?.telefone}
          />
          <InputField
            label="Email"
            name="email"
            register={register}
            defaultValue={fechamento.negocio?.consorciado?.email}
          />
        </div>
      </div>

      {/* Seção: Dados do Plano Contratado */}
      <div className="p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">
          Dados do Plano Contratado
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField
            label="Grupo"
            name="grupo"
            register={register}
            defaultValue={fechamento.grupo?.toString() || ""}
          />
          <InputField
            label="Cota"
            name="cota"
            register={register}
            defaultValue={fechamento.cota?.toString() || ""}
          />
          <InputField
            label="Espécie"
            name="especie"
            register={register}
            defaultValue={fechamento.especie || ""}
          />
          <InputField
            label="Marca"
            name="marca"
            register={register}
            defaultValue={fechamento.marca || ""}
          />
          <InputField
            label="Modelo"
            name="modelo"
            register={register}
            defaultValue={fechamento.modelo || ""}
          />
          <InputField
            label="Código do Bem"
            name="codigo_bem"
            register={register}
            defaultValue={fechamento.codigo_bem || ""}
          />
    
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
          <SelectInput
            label="Grupo em Formação"
            name="grupo_em_formacao"
            register={register}
            defaultValue={fechamento.grupo_em_formacao ? "1" : "0"}
            options={[
              { value: "1", label: "SIM" },
              { value: "0", label: "NÃO" },
            ]}
          />
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
          <InputField
            label="Data Assembleia"
            name="data_assembleia"
            register={register}
            defaultValue={
              fechamento.data_assembleia
                ? dayjs(fechamento.data_assembleia).format("YYYY-MM-DD")
                : ""
            }
            type="date"
          />

          <InputField
            label="Data Fechamento"
            name="data_fechamento"
            register={register}
            error={errors?.data_fechamento}
            isRequired={true}
            defaultValue={
              fechamento.data_fechamento
                ? dayjs(fechamento.data_fechamento).format("YYYY-MM-DD")
                : dayjs().format("YYYY-MM-DD")
            }
            type="date"
          />

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

      {/* Seção: Forma de Pagamento Inicial */}
      <div className="p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">
          Forma de Pagamento Inicial
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField
            label="Valor Crédito"
            name="preco_bem"
            register={register}
            defaultValue={
              fechamento.preco_bem ? fechamento.preco_bem.toString() : ""
            }
          />
          <InputField
            label="Parcela"
            name="parcela"
            register={register}
            defaultValue={
              fechamento.parcela ? fechamento.parcela.toString() : ""
            }
          />
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
      </div>

      <div className="bg-green-100 p-4 rounded shadow mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Informações do Comercial</h2>
          <button
            type="button"
            onClick={() =>
              append({ userId: "", modo: "", comissao: "", confirmed: false })
            }
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
          >
            Adicionar Vendedor
          </button>
        </div>
        <div className="overflow-x-auto">
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
      <div className="mt-6 text-end">
        <button
          type="button"
          onClick={() => window.print()}
          className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
        >
          <i className="mdi mdi-printer"></i> Imprimir
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          <i className="mdi mdi-content-save"></i> Salvar
        </button>
      </div>
    </form>
  );
}
