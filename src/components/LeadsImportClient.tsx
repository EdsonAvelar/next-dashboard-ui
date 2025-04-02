"use client";
import React, { useState } from "react";
import readXlsxFile from "read-excel-file";
import Papa from "papaparse";
import dayjs from "@/lib/dayjs";
import SpinIcon from "./ui/SpinIcon";
import { useRouter } from "next/navigation";
import PaginatedTable from "./PaginatedTable";
import { NegocioTipo } from "@prisma/client";

type Lead = {
  id?: number;
  nome: string;
  telefone: string;
  email?: string;
  tipo: NegocioTipo;
  campanha: string;
  fonte: string;
  data_conversao: string;
};

type LeadsImportClientProps = {
  importedLeads: any[];
  // Recebe também os dados adicionais vindos do componente pai
  massRelatedData: {
    users: any[];
    etapas: any[];
  };
};

export default function LeadsImportClient({
  importedLeads,
  massRelatedData, // { users, etapas }
}: LeadsImportClientProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [inProgress, setInprocess] = useState<Boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploadStatus("Processando arquivo...");
    setInprocess(true);

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    let rows: any[][] = [];
    try {
      if (extension === "csv") {
        const text = await selectedFile.text();
        const result = Papa.parse(text, {
          header: false,
          skipEmptyLines: true,
        });
        rows = result.data as any[][];
      } else if (extension === "xlsx") {
        rows = await readXlsxFile(selectedFile);
      } else {
        setUploadStatus("Formato de arquivo não suportado.");
        setInprocess(false);
        return;
      }
    } catch (error) {
      console.error(error);
      setUploadStatus("Erro ao ler o arquivo.");
      setInprocess(false);
      return;
    }

    // Considera que a primeira linha seja o cabeçalho:
    const header = rows[0];
    const leads: Lead[] = rows.slice(1).map((row) => ({
      nome: row[0] ?? "",
      telefone: row[1] ?? "",
      email: row[2] ?? "",
      tipo: row[3] ?? "",
      campanha: row[4] ?? "",
      fonte: row[5] ?? "",
      data_conversao: row[6] ?? "",
    }));

    try {
      const res = await fetch("/api/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads }),
      });

      const data = await res.json();
      if (res.ok) {
        router.refresh();
        setUploadStatus(
          `Importação concluída: ${data.imported} importados, ${data.rejected} rejeitados.`
        );
      } else {
        setUploadStatus(`Erro: ${data.error}`);
      }
    } catch (error) {
      setUploadStatus("Erro ao salvar os leads no servidor: " + error);
    } finally {
      setInprocess(false);
    }
  };

  // Define as colunas para a tabela
  const columns = [
    { header: "Nome do Lead", accessor: "nome", className: "w-1/4" },
    { header: "Telefone", accessor: "telefone", className: "w-1/6" },
    { header: "E-mail", accessor: "email", className: "w-1/4" },
    { header: "Tipo", accessor: "tipo", className: "w-1/6" },
    { header: "Fonte", accessor: "fonte", className: "w-1/6" },
    { header: "Campanha", accessor: "campanha", className: "w-1/6" },
    {
      header: "Data Conversão",
      accessor: "data_conversao",
      className: "w-1/6",
    },
  ];

  // Mapeia os leads para linhas da tabela, formatando a data de conversão
  const rowsElements = importedLeads.map((lead) => (
    <tr
      key={lead.id ?? Math.random()}
      data-rowid={lead.id}
      className="hover:bg-gray-50"
    >
      <td className="px-6 py-4 whitespace-nowrap">{lead.nome}</td>
      <td className="px-6 py-4 whitespace-nowrap">{lead.telefone}</td>
      <td className="px-6 py-4 whitespace-nowrap">{lead.email}</td>
      <td className="px-6 py-4 whitespace-nowrap">{lead.tipo}</td>
      <td className="px-6 py-4 whitespace-nowrap">{lead.fonte}</td>
      <td className="px-6 py-4 whitespace-nowrap">{lead.campanha}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {dayjs(lead.data_conversao).format("DD/MM/YYYY")}
      </td>
    </tr>
  ));

  return (
    <div>
      {/* Formulário de upload */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Importar Leads</h2>
        <p className="text-gray-700 mb-4">
          Faça o upload de um arquivo CSV ou XLSX. Certifique-se de usar o
          template correto.
        </p>
        <form
          onSubmit={handleUpload}
          className="space-y-4"
        >
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Enviar
          </button>
        </form>
        {uploadStatus && (
          <p className="mt-2 text-green-600 flex gap-2 items-center">
            {uploadStatus} {inProgress && <SpinIcon />}
          </p>
        )}
      </div>

      {/* Tabela de negócios importados utilizando PaginatedTable */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Leads Importados</h2>
        <PaginatedTable
          columns={columns}
          rows={rowsElements}
          // Como os leads importados já foram carregados, usamos page = 1 e count igual ao total de leads.
          page={1}
          count={importedLeads.length}
          massRelatedData={massRelatedData}
          allowedActions={["atribuir", "deletar"]}
          model="leadImportado"
        />
      </div>
    </div>
  );
}
