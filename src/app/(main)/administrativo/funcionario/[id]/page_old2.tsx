// app/dashboard/funcionarios/[id]/page.tsx (exemplo de rota)
// Se quiser usar como Server Component
import Badge from "@/components/Badge";
import ImageUpload from "@/components/ImageUpload";
import { getUserProfile } from "@/lib/actions";

export default async function SingleFuncionarioPage({
  params,
}: {
  params: { id: string };
}) {
  //   // Exemplo de dados "mock"
  //   const userData = {
  //     avatar: "/noAvatar.png",
  //     name: "Amanda Lopes",
  //     role: "Gerente Administrativo",
  //     phone: "(11) 99999-9999",
  //     email: "amanda@lola.com",
  //     hiredAt: "2023-04-10",
  //     equipe: "Sem Equipe",
  //     pageConcluido: "https://meusite.com/blogpost/concluido",
  //     landingPage: "https://meusite.com/landing/cadastro",
  //   };

  const user = await getUserProfile({ id: params.id });

  console.log(user);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Título da seção */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Informações
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Coluna Esquerda (Cartão de Informações) */}
          <div className="md:w-1/3 bg-white rounded-md shadow-sm p-4">
            {/* Foto e dados básicos */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                {/* <Image
                  src={userData.avatar}
                  alt="Foto do usuário"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                /> */}
                <ImageUpload
                  userId={params.id ?? ""}
                  defaultImage={user.avatar || "/noAvatar.png"}
                />
              </div>

              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.cargo.name}</p>
            </div>

            {/* Informações de contato */}
            <div className="mt-4 border-t pt-4 text-sm text-gray-600 space-y-2">
              <p>
                <span className="font-semibold">Telefone (WhatsApp): </span>
                {user.telefone}
              </p>
              <p>
                <span className="font-semibold">E-mail: </span>
                {user.email}
              </p>
              <p>
                <span className="font-semibold">Endereço: </span>
                {user.endereco}
              </p>
            </div>
          </div>

          {/* Coluna Direita (Formulário de Edição) */}
          <div className="md:w-2/3 bg-white rounded-md shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Informações Profissionais
            </h2>

            <form className="space-y-6">
              {/* Linha 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Telefone (WhatsApp)
                  </label>
                  <input
                    type="text"
                    defaultValue={user.telefone}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Linha 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Data Contratação
                  </label>
                  <input
                    type="date"
                    defaultValue={user.data_contratacao}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Linha 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Cargo
                  </label>
                  <input
                    type="text"
                    defaultValue={user.cargo.name}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Seção de Informações Comerciais */}
              <h3 className="text-md font-semibold text-gray-800">
                Informações Comerciais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Equipe
                  </label>
                  <select
                    defaultValue={user.equipe.name}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Sem Equipe</option>
                    <option>Equipe Alpha</option>
                    <option>Equipe Beta</option>
                  </select>
                </div>

                <div className="grid w-full h-full">
                  <label className="block text-sm text-gray-700 mb-1">
                    Permissões
                  </label>
                  <div>
                    {user.roles.map((i) => {
                      return <Badge type="blue">{i.name}</Badge>;
                    })}
                  </div>
                </div>
              </div>

              {/* Exemplo de campos adicionais */}
              <h3 className="text-md font-semibold text-gray-800">
                Informações de Marketing
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {/* <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Página Concluído
                  </label>
                  <input
                    type="text"
                    defaultValue={userData.pageConcluido}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Landinpage Cadastro
                  </label>
                  <input
                    type="text"
                    defaultValue={userData.landingPage}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div> */}
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md"
                >
                  Atualizar
                </button>
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm px-4 py-2 rounded-md"
                >
                  Voltar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
