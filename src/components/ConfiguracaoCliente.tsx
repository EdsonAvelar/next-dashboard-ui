// app/settings/SettingsClient.tsx
"use client";

import React, { useState } from "react";
import dayjs from "dayjs";

interface Production {
  id: number;
  name: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}

interface RelatedData {
  productions: Production[];
  activeProduction: Production | null;
  today: string; // Exemplo
}

interface SettingsClientProps {
  relatedData: RelatedData;
}

/**
 * Componente Client:
 * Recebe os dados do Container e exibe a página de configurações (abas, formulários etc.)
 */
export default function ConfiguracaoCliente({
  relatedData,
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<
    "artes" | "settings" | "config" | "marketing"
  >("artes");

  // Desestrutura os dados que vieram do servidor
  const { productions, activeProduction, today } = relatedData;

  const handleTabChange = (
    tab: "artes" | "settings" | "config" | "marketing"
  ) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Configurações</h1>

      {/* Menu de Abas */}
      <ul className="flex border-b border-gray-200 mb-6">
        <li
          className={`cursor-pointer px-4 py-2 ${
            activeTab === "artes"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => handleTabChange("artes")}
        >
          Artes do Site
        </li>
        <li
          className={`cursor-pointer px-4 py-2 ${
            activeTab === "settings"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => handleTabChange("settings")}
        >
          Editar Informações
        </li>
        <li
          className={`cursor-pointer px-4 py-2 ${
            activeTab === "config"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => handleTabChange("config")}
        >
          Configurações CRM
        </li>
        <li
          className={`cursor-pointer px-4 py-2 ${
            activeTab === "marketing"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => handleTabChange("marketing")}
        >
          Marketing
        </li>
      </ul>

      {/* Conteúdo das Abas */}
      <div className="bg-white rounded shadow p-4">
        {activeTab === "artes" && <ArtesDoSite />}
        {activeTab === "settings" && (
          <EditarInformacoes
            productions={productions}
            activeProduction={activeProduction}
          />
        )}
        {activeTab === "config" && <ConfiguracoesCRM today={today} />}
        {activeTab === "marketing" && <Marketing />}
      </div>
    </div>
  );
}

/* ABA 1: Artes do Site */
function ArtesDoSite() {
  const images = [
    {
      title: "Logo Circular (512x512)",
      src: "/images/empresa/logos/empresa_logo_circular.png",
    },
    {
      title: "Logo Horizontal (512x256)",
      src: "/images/empresa/logos/empresa_logo_transparente.png",
    },
    { title: "Favicon (48x48)", src: "/images/empresa/logos/favicon.ico" },
    // ...
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Artes do Site</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="border rounded shadow-sm p-3 text-center"
          >
            <h5 className="text-md font-semibold mb-2 text-gray-700">
              {img.title}
            </h5>
            <img
              src={img.src}
              alt={img.title}
              className="mx-auto mb-2 h-24 object-cover rounded"
            />
            <button
              onClick={() =>
                alert(`Função para editar/imagem_save: ${img.src}`)
              }
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition"
            >
              Alterar Imagem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ABA 2: Editar Informações */
function EditarInformacoes({
  productions,
  activeProduction,
}: {
  productions: Production[];
  activeProduction: Production | null;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Informações atualizadas!");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Editar Informações
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Nome Completo da Empresa
          </label>
          <input
            type="text"
            className="border w-full px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-200"
            defaultValue="Minha Empresa LTDA"
          />
        </div>
        {/* ... outros campos */}
        <div className="col-span-1 sm:col-span-2 text-right">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Atualizar
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700">
          Produções Ativas
        </h3>
        <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
          {productions.map((p) => (
            <li
              key={p.id}
              className={
                p.id === activeProduction?.id ? "font-bold text-blue-600" : ""
              }
            >
              {p.name} {p.id === activeProduction?.id && "(Ativa)"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ABA 3: Configurações CRM */
function ConfiguracoesCRM({ today }: { today: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Configurações CRM
      </h2>
      <p className="text-sm text-gray-700 mb-2">
        Data atual (exemplo): {today}
      </p>
      <div className="space-y-4">
        {/* Toggles ou qualquer outra config */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="h-5 w-5 text-blue-600"
            defaultChecked
          />
          <span>Notificação de Nova Venda</span>
        </label>
      </div>
    </div>
  );
}

/* ABA 4: Marketing */
function Marketing() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Marketing</h2>
      <p className="text-sm text-gray-700 mb-4">
        Integração de Leads via Webhook. Exemplo de cURL:
      </p>
      <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
        {`curl -X POST https://example.com/api/webhook/newlead \\
  -H "Authorization: Bearer SEU_TOKEN" \\
  -d '{"nome":"Nome Cliente","telefone":"1123456789","email":"client@com.br","campanha":"FaceAds-Cadastro-Imovel","fonte":"FACEBOOK","tipo_do_bem":"IMOVEL","proprietario_id":"-1"}'
`}
      </pre>
    </div>
  );
}
