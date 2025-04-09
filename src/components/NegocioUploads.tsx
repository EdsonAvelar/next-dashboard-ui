"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { deleteUploadFile } from "@/lib/actions";
import DeleteConfirmation from "./DeleteConfirmation"; // importe o componente

type UploadFile = {
  id: number;
  fileName: string;
  filePath: string;
  extension: string | null;
  fileSize: number | null;
  description: string | null;
  createdAt: string;
};

interface NegocioUploadsProps {
  negocioId: number;
}

export default function NegocioUploads({ negocioId }: NegocioUploadsProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  async function fetchUploads() {
    try {
      const res = await fetch(`/api/uploads?negocioId=${negocioId}`);
      const data = await res.json();
      setUploads(data.uploads);
    } catch (err) {
      console.error(err);
    }
  }

  // Quando o botão delete é clicado, abre o DeleteConfirmation
  const handleDeleteClick = (id: number) => {
    setSelectedDeleteId(id);
    setShowDeleteConfirmation(true);
  };

  // Função submit é feita pelo DeleteConfirmation via o componente
  // Assim, não chamamos deleteUploadFile() diretamente aqui

  useEffect(() => {
    fetchUploads();
  }, [negocioId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Selecione um arquivo.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    formData.append("negocioId", negocioId.toString());
    const res = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Arquivo enviado com sucesso!");
      setFile(null);
      setDescription("");
      fetchUploads();
    } else {
      toast.error(data.msg || "Erro ao enviar arquivo.");
    }
  };

  // Renderiza miniatura ou ícone dependendo da extensão
  const renderPreview = (upload: UploadFile) => {
    const ext = upload.extension?.toLowerCase();
    if (ext && ["jpg", "jpeg", "png", "gif"].includes(ext)) {
      return (
        <img
          src={upload.filePath}
          alt={upload.fileName}
          className="w-16 h-16 object-cover"
        />
      );
    } else if (ext === "pdf") {
      return (
        <span className="text-red-500 text-2xl">
          <Icon
            icon="mdi:file-pdf-box"
            className="w-8 h-8 text-red-500"
          />
        </span>
      );
    } else if (ext === "doc" || ext === "docx") {
      return (
        <span className="text-blue-500 text-2xl">
          <Icon
            icon="mdi:microsoft-word"
            className="w-8 h-8"
          />
        </span>
      );
    } else {
      return <span className="text-gray-500 text-2xl">📁</span>;
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Gerenciar Arquivos do Negócio</h2>
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 border rounded bg-gray-50"
      >
        <div className="mb-4">
          <label className="block font-medium mb-2">
            Selecione um arquivo (Máx 2MB)
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Descrição</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Digite uma descrição para o arquivo"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Fazer Upload
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-2">Arquivos Enviados</h3>
        {uploads.length > 0 ? (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Nome do Arquivo</th>
                <th className="p-2 text-left">Descrição</th>
                <th className="p-2 text-left">Miniatura</th>
                <th className="p-2 text-left">Data de Upload</th>
                <th className="p-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((upload) => (
                <tr
                  key={upload.id}
                  className="border-b"
                >
                  <td className="p-2">{upload.fileName}</td>
                  <td className="p-2">{upload.description}</td>
                  <td className="p-2">{renderPreview(upload)}</td>
                  <td className="p-2">
                    {new Date(upload.createdAt).toLocaleString()}
                  </td>
                  <td className="p-2 flex gap-2">
                    <a
                      href={upload.filePath}
                      download
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Icon
                        icon="mdi:download"
                        className="w-6 h-6"
                      />
                    </a>
                    <button
                      onClick={() => handleDeleteClick(upload.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Icon
                        icon="mdi:delete"
                        className="w-6 h-6"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum arquivo enviado.</p>
        )}
      </div>

      {showDeleteConfirmation && selectedDeleteId !== null && (
        <DeleteConfirmation
          message="Você confirma a exclusão deste arquivo?"
          selectedIds={[selectedDeleteId]}
          model="upload" // Certifique-se de que o DeleteConfirmation e a ação dele aceitem este modelo
          onClose={() => {
            setShowDeleteConfirmation(false);
            setSelectedDeleteId(null);
            fetchUploads();
          }}
        />
      )}
    </div>
  );
}
