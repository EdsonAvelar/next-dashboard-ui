import {
  HomeIcon,
  UserGroupIcon,
  CogIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { HOMEPAGE } from "./settings";

export function getSidenavItems(userId?: number | string) {
  return [
    {
      title: "Dashboards",
      icon: HomeIcon,
      children: [
        {
          label: "Geral",
          href: HOMEPAGE,
          params: userId ? `proprietario_id=${userId}` : "",
        },
        { label: "Equipes", href: "/dashboard/equipes" },
        { label: "Semanal", href: "/dashboard/semanal" },
        { label: "Produção", href: "/dashboard/producao" },
      ],
    },
    {
      title: "Negócios",
      icon: BriefcaseIcon,
      children: [
        {
          label: "Pipeline",
          href: "/negocios/pipeline",
          params: userId ? `proprietario_id=${userId}` : "",
        },
        {
          label: "Lista",
          href: "/negocios/lista",
          params: userId ? `proprietario_id=${userId}` : "",
        },
        {
          label: "Agendamentos",
          href: "/negocios/agendamentos",
          params: userId ? `proprietario_id=${userId}` : "",
        },
        {
          label: "Reunioes",
          href: "/negocios/reunioes",
          params: userId ? `proprietario_id=${userId}` : "",
        },
        {
          label: "Vendas Fechadas",
          href: "/negocios/vendas",
          params: userId ? `proprietario_id=${userId}` : "",
        },
      ],
    },
    {
      title: "Administrativo",
      icon: UserGroupIcon,
      children: [
        { label: "Funcionarios", href: "/administrativo/funcionario" },
        { label: "Produções", href: "/administrativo/producoes" },
        { label: "Equipes", href: "/administrativo/equipes" },
      ],
    },
    {
      title: "Configurações",
      icon: CogIcon,
      children: [
        { label: "Minha Conta", href: "/profile" },
        { label: "Permissões", href: "/permissions" },
        { label: "Empresa", href: "/settings" },
        { label: "Logout", href: "/logout" },
      ],
    },
  ];
}
