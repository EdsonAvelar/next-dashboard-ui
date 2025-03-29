// app/settings/SettingsClient.tsx
"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import ImageUploadCrop from "@/components/ImageUploadCrop";
import ConfiguracoesCRM from "./ConfigPanel/ConfiguracoesCRM";

interface Production {
  id: number;
  name: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}

interface User {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  descricao?: string;
  users: User[];
}

interface ImageData {
  id: number;
  title: string;
  aspect: number;
  defaultImage: string;
  field: string;
  filename: string;
  description: string;
  width?: number;
  height?: number;
}

interface RelatedData {
  productions: Production[];
  activeProduction: Production | null;
  today: string;
  roles: Role[];
  crmImages: ImageData[];
  simulationImages: ImageData[];
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
    "artes" | "settings" | "config" | "marketing" | "permissoes"
  >("artes");

  // Desestrutura os dados que vieram do servidor
  const {
    productions,
    activeProduction,
    today,
    roles,
    crmImages,
    simulationImages,
  } = relatedData;

  const handleTabChange = (
    tab: "artes" | "settings" | "config" | "marketing" | "permissoes"
  ) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mx-auto px-4 py-6 ">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Configurações</h1>

      {/* Menu de Abas */}
      <div className="border-b border-gray-200 mb-6 ">
        <nav
          className="flex space-x-4"
          aria-label="Tabs"
        >
          <button
            onClick={() => handleTabChange("artes")}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === "artes"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Artes do Site
          </button>
          <button
            onClick={() => handleTabChange("settings")}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === "settings"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Editar Informações
          </button>
          <button
            onClick={() => handleTabChange("config")}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === "config"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Configurações CRM
          </button>
          <button
            onClick={() => handleTabChange("marketing")}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === "marketing"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Marketing
          </button>
          <button
            onClick={() => handleTabChange("permissoes")}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === "permissoes"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Permissões
          </button>
        </nav>
      </div>

      {/* Conteúdo das Abas */}
      <div className="bg-white rounded p-4 shadow-all">
        {activeTab === "artes" && (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Artes do Site
            </h2>
            {/* Seção de Personalização do CRM */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                Imagens de Personalização do CRM
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {crmImages.map((img, index) => (
                  <div
                    key={img.id}
                    className="border rounded-lg shadow-sm p-4 flex flex-col items-center"
                  >
                    <h5 className="text-md font-semibold mb-2 text-gray-700">
                      {img.title}
                    </h5>
                    <div className="text-xs text-gray-500 mb-3 text-center">
                      {img.description}
                    </div>
                    <div className="flex-grow flex items-center justify-center w-full mb-3">
                      <ImageUploadCrop
                        aspect={img.aspect}
                        id={img.id}
                        database="config"
                        field={img.field}
                        configType="system_image"
                        defaultImage={img.defaultImage}
                        filename={img.filename}
                        folder="empresa"
                        onCropComplete={(url) =>
                          toast.success(
                            `Imagem ${img.title} atualizada: ${url}`
                          )
                        }
                        width={img.width || 200}
                        height={img.height || 200}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Seção de Imagens de Simulações */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                Imagens de Simulações
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {simulationImages.map((img) => (
                  <div
                    key={img.id}
                    className="border rounded-lg shadow-sm p-4 flex flex-col items-center"
                  >
                    <h5 className="text-md font-semibold mb-2 text-gray-700">
                      {img.title}
                    </h5>
                    <div className="text-xs text-gray-500 mb-3 text-center">
                      {img.description}
                    </div>
                    <div className="flex-grow flex items-center justify-center w-full mb-3">
                      <ImageUploadCrop
                        aspect={img.aspect}
                        id={img.id}
                        database="config"
                        field={img.field}
                        configType="system_image"
                        defaultImage={img.defaultImage}
                        filename={img.filename}
                        folder="empresa"
                        onCropComplete={(url) =>
                          toast.success(
                            `Imagem ${img.title} atualizada: ${url}`
                          )
                        }
                        width={img.width || 200}
                        height={img.height || 200}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {activeTab === "settings" && (
          <EditarInformacoes
            productions={productions}
            activeProduction={activeProduction}
          />
        )}
        {activeTab === "config" && <ConfiguracoesCRM />}
        {activeTab === "marketing" && <Marketing />}
        {activeTab === "permissoes" && <Permissoes roles={roles} />}
      </div>
    </div>
  );
}

/* Nova ABA: Permissões */
function Permissoes({ roles }: { roles: Role[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Gerenciamento de Permissões
        </h2>
        {/* <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground bg-indigo-600 text-white shadow hover:bg-indigo-700 transition-colors">
          Nova Permissão
        </button> */}
      </div>

      <div className="rounded-md border border-gray-200">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-gray-50">
              <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">
                Nome
              </th>
              <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">
                Usuários Atribuídos
              </th>
              <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">
                Descrição
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {roles.map((role) => (
              <tr
                key={role.id}
                className="border-b transition-colors hover:bg-gray-50/50"
              >
                <td className="p-3">
                  <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-indigo-500 text-primary-foreground text-white shadow hover:bg-indigo-500/80">
                    {role.name}
                  </div>
                </td>
                <td className="p-3">
                  {role.users.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {role.users.map((user) => (
                        <div
                          key={user.id}
                          className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500 text-primary-foreground text-white shadow hover:bg-green-500/80"
                        >
                          {user.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">
                      Nenhum usuário
                    </span>
                  )}
                </td>
                <td className="p-3 text-sm text-gray-600">
                  {role.descricao || "—"}
                </td>
              </tr>
            ))}
            {roles.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="h-24 text-center text-gray-500"
                >
                  Nenhuma permissão encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ABA 1: Artes do Site */

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
// function ConfiguracoesCRM({ today }: { today: string }) {
//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4 text-gray-800">
//         Configurações CRM
//       </h2>
//       <p className="text-sm text-gray-700 mb-2">
//         Data atual (exemplo): {today}
//       </p>
//       <div className="space-y-4">
//         {/* Toggles ou qualquer outra config */}
//         <label className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             className="h-5 w-5 text-blue-600"
//             defaultChecked
//           />
//           <span>Notificação de Nova Venda</span>
//         </label>
//       </div>
//     </div>
//   );
// }

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
