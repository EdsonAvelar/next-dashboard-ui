"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HomeIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CogIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { HOMEPAGE } from "@/lib/settings";

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
    children: [{ label: "Lista", href: "/negocios/lista" }],
  },
  {
    title: "Administrativo",
    icon: UserGroupIcon,
    children: [{ label: "Funcionarios", href: "/administrativo/funcionario" }],
  },
  {
    title: "Configurações",
    icon: CogIcon,
    children: [
      { label: "Minha Conta", href: "/profile" },
      { label: "Empresa", href: "/settings" },
      { label: "Logout", href: "/logout" },
    ],
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Estado para controle de hover no modo colapsado (expansão temporária)
  const [isHovered, setIsHovered] = useState(false);

  // Estado para controlar quais submenus estão abertos (por índice)
  const [openSubmenus, setOpenSubmenus] = useState<Record<number, boolean>>({});

  // Função para alternar submenu (por clique)
  const toggleSubmenu = (idx: number) => {
    setOpenSubmenus((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Funções para hover: somente se estiver colapsado persistentemente
  const handleMouseEnter = () => {
    if (isCollapsed) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isCollapsed) setIsHovered(false);
  };

  return (
    <div
      className={`h-full relative flex-shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 
        Se o menu não está colapsado persistentemente (isCollapsed false),
        renderizamos o conteúdo normalmente.
        Se está colapsado, mas está sendo hover, renderizamos uma div
        expandida em overlay (absolute) que não altera a largura do contêiner pai.
      */}
      {!isCollapsed || isHovered ? (
        // Modo expandido (persistente ou temporário via hover)
        <div className="absolute inset-0 z-50 w-64 bg-white border-r border-gray-200 transition-all duration-500 ease-in-out overflow-hidden">
          {/* Cabeçalho/Logo */}
          <div className="p-4 border-b border-gray-200">
            <span className="block font-bold overflow-hidden whitespace-nowrap">
              LOGO
            </span>
          </div>
          {/* Itens do Menu */}
          <div className="overflow-y-auto h-[80%]">
            {menuData.map((menu, idx) => {
              // Se o item possui submenus (children)
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
                          href={child.href}
                          className="block pl-8 pr-2 py-2 text-sm hover:bg-gray-50"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              // Caso seja um menu sem submenu (items)
              return null;
            })}
          </div>

          {/* Botão de Colapsar/Expandir (na parte inferior do menu expandido) */}
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
        // Modo colapsado (sem hover): renderiza apenas o conteúdo mínimo, que já está no contêiner pai
        <div className="w-full h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden">
          <div className="p-4">
            <span className="block font-bold">LOGO</span>
          </div>
          {/* Aqui você pode renderizar somente ícones se desejar */}
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
