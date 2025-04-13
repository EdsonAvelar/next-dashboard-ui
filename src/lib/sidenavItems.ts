import {
  HomeIcon,
  UserGroupIcon,
  CogIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowLeftEndOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export function getSidenavItems(userId?: number | string) {
  return [
    {
      title: "Dashboards",
      icon: HomeIcon,
      prefix: "/dashboard",
      children: [
        { label: "Comercial", href: "/comercial", allowed: ["time_comercial"] },
        {
          label: "Geral",
          href: "/geral",
          params: userId ? `proprietario_id=${userId}` : "",
          allowed: ["gerente_geral"],
        },
        { label: "Equipes", href: "/equipes", allowed: ["gerente_geral"] },
        { label: "Semanal", href: "/semanal", allowed: ["gerente_geral"] },
        { label: "Produção", href: "/producao", allowed: ["gerente_geral"] },
      ],
    },
    {
      title: "Negócios",
      icon: BriefcaseIcon,
      prefix: "/negocios",
      children: [
        {
          label: "Pipeline",
          href: "/pipeline",
          params: userId ? `proprietario_id=${userId}` : "",
          allowed: ["time_comercial", "gerente_geral"],
        },
        {
          label: "Lista",
          href: "/lista",
          params: userId ? `proprietario_id=${userId}` : "",
          allowed: ["gerente_geral"],
        },
        {
          label: "Agendamentos",
          href: "/agendamentos",
          params: userId ? `proprietario_id=${userId}` : "",
          allowed: ["gerente_geral"],
        },
        {
          label: "Reunioes",
          href: "/reunioes",
          params: userId ? `proprietario_id=${userId}` : "",
          allowed: ["gerente_geral"],
        },
        {
          label: "Vendas",
          href: "/vendas",
          params: userId ? `proprietario_id=${userId}` : "",
          allowed: ["gerente_geral"],
        },
        {
          label: "Importar",
          href: "/importar",
          params: userId ? `proprietario_id=${userId}` : "",
          allowed: ["gerente_geral"],
        },
      ],
    },
    {
      title: "Administrativo",
      icon: UserGroupIcon,
      prefix: "/administrativo",
      children: [
        {
          label: "Funcionarios",
          href: "/funcionario",
          allowed: ["gerente_geral"],
        },
        { label: "Produções", href: "/producoes", allowed: ["gerente_geral"] },
        { label: "Equipes", href: "/equipes", allowed: ["gerente_geral"] },
      ],
    },
    {
      title: "Configurações",
      icon: CogIcon,
      prefix: "/configuracoes",
      children: [
        // { label: "Minha Conta", href: "/profile" },
        { label: "Sistema", href: "/sistema", allowed: ["gerente_geral"] },
        {
          label: "Permissões",
          href: "/permissions",
          allowed: ["gerente_geral"],
        },
      ],
    },
    {
      title: "Usuário",
      icon: UserIcon, // novo ícone de usuário
      prefix: "/user",
      children: [
        {
          label: "Minha Conta",
          ignorePrefix: true,
          href: `/administrativo/funcionario/${userId}`,
        },
        { label: "Logout", href: "/logout" },
      ],
    },
  ];
}
