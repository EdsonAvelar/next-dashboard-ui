"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
import { createMassNegocio } from "@/lib/actions";
import { formatCurrency, NegocioTipoOptions } from "@/lib/utils";

// Schema para o formulário de importação em massa
const negocioMassSchema = z.object({
  tipo_credito: z.string(),
  negocios: z.string().min(1, "Insira os dados dos negócios"),
});

type NegocioMassFormSchema = z.infer<typeof negocioMassSchema>;

// Tipos para os registros e erros
type NegocioRecord = {
  name: string;
  telefone: string;
  credito?: number | null;
  raw: string;
};

type ParseError = {
  line: number;
  message: string;
  raw: string;
};

// Função que processa o conteúdo do textarea, linha a linha
function parseNegocios(input: string): {
  records: NegocioRecord[];
  errors: ParseError[];
} {
  const lines = input.split("\n");
  const records: NegocioRecord[] = [];
  const errors: ParseError[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const parts = trimmed.split(",");
    // Deve haver 2 ou 3 campos: nome, telefone e (opcional) crédito
    if (parts.length < 2 || parts.length > 3) {
      errors.push({
        line: index + 1,
        message: "Número incorreto de campos",
        raw: line,
      });
      return;
    }

    const name = parts[0].trim();
    const telefone = parts[1].trim();
    const creditoStr = parts.length === 3 ? parts[2].trim() : "";

    if (!name) {
      errors.push({ line: index + 1, message: "Nome inválido", raw: line });
      return;
    }
    if (!/^\d+$/.test(telefone)) {
      errors.push({ line: index + 1, message: "Telefone inválido", raw: line });
      return;
    }

    let credito: number | null = null;
    if (creditoStr !== "") {
      if (!/^\d+$/.test(creditoStr)) {
        errors.push({
          line: index + 1,
          message: "Valor do crédito inválido",
          raw: line,
        });
        return;
      }
      credito = Number(creditoStr);
    }

    records.push({ name, telefone, credito, raw: line });
  });

  return { records, errors };
}

const NegocioMassForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors: formErrors },
  } = useForm<NegocioMassFormSchema>({
    resolver: zodResolver(negocioMassSchema),
    defaultValues: {
      tipo_credito: "IMOVEL",
      negocios: "",
    },
  });

  const searchParams = useSearchParams();
  const proprietarioId = searchParams.get("proprietario_id") || "";

  const router = useRouter();
  const negociosValue = watch("negocios");
  const [parsedRecords, setParsedRecords] = useState<NegocioRecord[]>([]);
  const [parsedErrors, setParsedErrors] = useState<ParseError[]>([]);

  // Atualiza a pré-visualização conforme o usuário edita o textarea
  useEffect(() => {
    const { records, errors } = parseNegocios(negociosValue);
    setParsedRecords(records);
    setParsedErrors(errors);
  }, [negociosValue]);

  // Configura o estado do formulário usando a função de criação massiva
  const [state, formAction] = useFormState(createMassNegocio, {
    success: false,
    msg: "",
  });

  const onSubmit = handleSubmit(async (formData) => {
    // Se houver erros de formatação, impede o salvamento
    if (parsedErrors.length > 0) {
      toast.error("Existem erros na formatação. Corrija-os antes de salvar.");
      return;
    }

    // Prepara o payload para a ação de criação em massa
    const payload = {
      tipo_credito: formData.tipo_credito,
      proprietario_id: proprietarioId,
      registros: parsedRecords,
    };

    // Chama a função para salvar os negócios no banco
    formAction(payload);
  });

  // Se a ação for bem-sucedida, exibe uma notificação e atualiza a página
  useEffect(() => {
    if (state.success) {
      toast.success("Negócios importados com sucesso!");
      reset();
      setOpen(false);
      router.refresh();
    }
  }, [state]);

  const handleCancel = () => {
    reset();
    setParsedRecords([]);
    setParsedErrors([]);
    setOpen(false);
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl font-semibold">Importar Negócios</h1>
      <span className="text-xs text-gray-400 font-medium">
        Selecione o Tipo de Crédito e insira os dados dos negócios (um por
        linha).
      </span>

      {/* Seleção do Tipo de Crédito via radiobox */}
      <div>
        <h2>Tipo de Crédito</h2>
        <div className="flex gap-4 bg">
          {NegocioTipoOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-1"
            >
              <input
                type="radio"
                value={option.value}
                {...register("tipo_credito")}
              />
              {option.label}
            </label>
          ))}
        </div>
        {formErrors.tipo_credito && (
          <span className="text-red-500 text-xs">
            {formErrors.tipo_credito.message}
          </span>
        )}
      </div>

      {/* Área para inserir os dados dos negócios */}

      <div className="flex justify-between gap-2 w-full">
        <div className="w-full ">
          <div>
            <h2 className="py-2 font-semibold text-purple-700">
              Dados dos Negócios
            </h2>
            <textarea
              rows={10}
              className="w-full p-2 border border-gray-300 rounded h-[300px] "
              placeholder={`Exemplos:
Fulano 1,123456
Fulano 2,234567, 500000`}
              {...register("negocios")}
            ></textarea>
            {formErrors.negocios && (
              <span className="text-red-500 text-xs">
                {formErrors.negocios.message}
              </span>
            )}
          </div>
        </div>
        <div className="w-full h-full ">
          <h2 className="py-2 font-semibold text-purple-700">
            Pré-visualização
          </h2>
          <div className="w-full h-full p-4 ">
            <div className="h-[300px] overflow-y-scroll">
              {parsedRecords.length > 0 && (
                <div>
                  <h4 className="font-medium">Negócios Válidos:</h4>
                  <ul className="list-disc ml-4">
                    {parsedRecords.map((record, idx) => (
                      <li key={idx}>
                        <strong>{record.name}</strong> - Telefone:{" "}
                        {record.telefone}
                        {record.credito !== null &&
                          ` - Crédito: R$ ${record.credito !== undefined ? formatCurrency(record.credito) : "N/A"} `}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {parsedErrors.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-600">
                    Erros de Formatação:
                  </h4>
                  <ul className="list-disc ml-4">
                    {parsedErrors.map((error, idx) => (
                      <li key={idx}>
                        Linha {error.line}: {error.message} (Conteúdo: "
                        {error.raw}")
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pré-visualização dos registros e erros */}

      {/* Botões de Cancelar e Salvar */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-400 text-white p-2 rounded hover:bg-blue-500"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};

export default NegocioMassForm;
