"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  HomeIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CogIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { HOMEPAGE } from "@/lib/settings";
import { useWindowSize } from "@/hooks/useWindowSize"; // ajuste o caminho conforme sua estrutura
import { getCurrentUser, UserProfile } from "@/lib/actions";

export default function Sidebar() {

  const [user, setUser] = useState<UserProfile | null>(null);
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/currentUser");
      const data = await res.json();
      setUser(data);
    }
    fetchUser();
  }, []);

  const menuData = [
    {
      title: "Dashboards",
      icon: HomeIcon,
      children: [
        { label: "Geral", href: HOMEPAGE },
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
          params: `proprietario_id=${user?.id}`,
        },
        {
          label: "Lista",
          href: "/negocios/lista",
          params: `proprietario_id=${user?.id}`,
        },
        { label: "Agendamentos", href: "/negocios/agendamentos", params: `proprietario_id=${user?.id}`, },
        { label: "Reunioes", href: "/negocios/reunioes", params: `proprietario_id=${user?.id}`, },
      ],
    },
    {
      title: "Administrativo",
      icon: UserGroupIcon,
      children: [
        { label: "Funcionarios", href: "/administrativo/funcionario" },
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

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<number, boolean>>({});

  // Usa o hook customizado para monitorar o tamanho da janela
  const { width } = useWindowSize();

  // Atualiza isCollapsed sempre que a largura muda
  useEffect(() => {
    if (width < 768) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [width]);

  const toggleSubmenu = (idx: number) => {
    setOpenSubmenus((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleMouseEnter = () => {
    if (isCollapsed) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isCollapsed) setIsHovered(false);
  };

  return (
    <div
      className={`h-full relative flex-shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-[13rem]"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isCollapsed || isHovered ? (
        <div className="absolute inset-0 z-50 w-[13rem] bg-white border-r border-gray-200 transition-all duration-500 ease-in-out overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <span className="block font-bold overflow-hidden whitespace-nowrap">
              LOGO
            </span>
          </div>
          <div className="overflow-y-auto h-[80%]">
            {menuData.map((menu, idx) => {
              if (menu.children) {
                const isOpen = !!openSubmenus[idx];
                const ArrowIcon = isOpen ? ChevronDownIcon : ChevronRightIcon;
                return (
                  <div
                    key={idx}
                    className="relative px-2 py-2"
                  >
                    <button
                      onClick={() => toggleSubmenu(idx)}
                      className="flex items-center w-full gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      {menu.icon && <menu.icon className="h-5 w-5" />}
                      <span className="flex-1 text-left overflow-hidden whitespace-nowrap">
                        {menu.title}
                      </span>
                      <ArrowIcon className="h-4 w-4" />
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      {menu.children.map((child, cIdx) => (
                        <Link
                          key={cIdx}
                          href={
                            child.href +
                            (child.params ? `?${child.params}` : "")
                          }
                          className="block pl-8 pr-2 py-2 text-sm hover:bg-gray-50"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
          <div className="p-2 border-t border-gray-200">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full p-2 rounded-md text-center hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? ">>" : "<<"}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden">
          <div className="p-4">
            <span className="block font-bold">LOGO</span>
          </div>
          <div className="flex flex-col items-center">
            {menuData.map((menu, idx) => (
              <div
                key={idx}
                className="p-2"
              >
                {menu.icon && <menu.icon className="h-5 w-5" />}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-gray-200">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full p-2 rounded-md text-center hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? ">>" : "<<"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
