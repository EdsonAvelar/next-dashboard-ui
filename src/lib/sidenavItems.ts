import {
  HomeIcon,
  UserGroupIcon,
  CogIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export function getSidenavItems(userId?: number | string) {
  return [
    {
      title: "Dashboards",
      icon: HomeIcon,
      prefix: "/dashboard",
      children: [
        {
          label: "Geral",
          href: "/geral",
          params: userId ? `proprietario_id=${userId}` : "",
        },
        { label: "Equipes", href: "/equipes" },
        { label: "Semanal", href: "/semanal" },
        { label: "Produção", href: "/producao" },
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
        },
        {
          label: "Lista",
          href: "/lista",
          params: userId ? `proprietario_id=${userId}` : "",
        },
        {
          label: "Agendamentos",
          href: "/agendamentos",
          params: userId ? `proprietario_id=${userId}` : "",
        },
        {
          label: "Reunioes",
          href: "/reunioes",
          params: userId ? `proprietario_id=${userId}` : "",
        },
        {
          label: "Vendas",
          href: "/vendas",
          params: userId ? `proprietario_id=${userId}` : "",
        },
        {
          label: "Importar",
          href: "/importar",
          params: userId ? `proprietario_id=${userId}` : "",
        },
      ],
    },
    {
      title: "Administrativo",
      icon: UserGroupIcon,
      prefix: "/administrativo",
      children: [
        { label: "Funcionarios", href: "/funcionario" },
        { label: "Produções", href: "/producoes" },
        { label: "Equipes", href: "/equipes" },
      ],
    },
    {
      title: "Configurações",
      icon: CogIcon,
      prefix: "/configuracoes",
      children: [
        { label: "Minha Conta", href: "/profile" },
        // { label: "Permissões", href: "/permissions" },
        { label: "Sistema", href: "/sistema" },
        { label: "Logout", href: "/logout" },
      ],
    },
  ];
}
