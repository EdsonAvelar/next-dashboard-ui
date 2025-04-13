"use client";
import Link from "next/link";
import { usePathname } from "next/navigation"; // se estiver no App Router
import { useState } from "react";
import {
  HomeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  UserIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  MegaphoneIcon,
  UserCircleIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

import { role } from "@/lib/data";
import { theme } from "../theme"; // Nosso arquivo de tema
import Image from "next/image";

// Mapeamento de ícones
const iconMapping = {
  Home: HomeIcon,
  Teachers: AcademicCapIcon,
  Students: UserGroupIcon,
  Parents: UserIcon,
  Subjects: BookOpenIcon,
  Classes: BuildingOffice2Icon,
  Lessons: DocumentTextIcon,
  Exams: ClipboardDocumentCheckIcon,
  Assignments: ClipboardDocumentListIcon,
  Results: ChartBarIcon,
  Attendance: CheckBadgeIcon,
  Events: CalendarDaysIcon,
  Messages: ChatBubbleBottomCenterTextIcon,
  Announcements: MegaphoneIcon,
  Profile: UserCircleIcon,
  Settings: CogIcon,
  Logout: ArrowLeftOnRectangleIcon,
  BookOpen: BookOpenIcon,
};

// Exemplo de menu com submenus
const menuItems = [
  {
    title: "Dashboards",
    icon: "Home",
    visible: ["admin", "teacher", "student", "parent"],
    children: [
      { label: "CRM", href: "/dashboard/crm" },
      { label: "Analytics", href: "/dashboard/analytics" },
      { label: "eCommerce", href: "/dashboard/ecommerce" },
      { label: "Academy", href: "/dashboard/academy" },
      { label: "Logistics", href: "/dashboard/logistics" },
    ],
  },
  {
    title: "MENU",
    items: [
      {
        icon: "Teachers",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "Students",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      // ...
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "Profile",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Settings",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Logout",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname(); // Para saber qual rota está ativa (App Router)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Controla quais submenus estão abertos. Ex: { 0: true, 1: false, ... }
  const [openSubmenus, setOpenSubmenus] = useState<Record<number, boolean>>({});

  // Expandir/colapsar um submenu específico
  const handleToggleSubmenu = (index: number) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div
      className={`
        flex flex-col
        ${theme.sidebar.bg} ${theme.sidebar.text}
        ${isCollapsed ? theme.sidebar.collapsedWidth : theme.sidebar.expandedWidth}
        ${theme.transition}
      `}
      style={{ minWidth: isCollapsed ? "4rem" : "16rem" }}
    >
      <Link
        href="/"
        className="flex items-center justify-center p-4 gap-2"
      >
        <Image
          src="/logo.png"
          alt="logo"
          width={32}
          height={32}
        />
        <span className="hidden lg:block font-bold">
          {isCollapsed ? "" : "XConCRM"}
        </span>
      </Link>
      {/* Área rolável */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Logo / Título */}
        <div className="p-4 font-bold text-xl">
          {isCollapsed ? "M" : "MySystem"}
        </div>

        {menuItems.map((menu, index) => {
          // Se for um menu com children (submenus)
          if (menu.children) {
            // Verifica se o usuário tem permissão (pelo menos um item visível)
            const anyVisible = menu.visible?.includes(role);
            if (!anyVisible) return null;

            const Icon = iconMapping[menu.icon as keyof typeof iconMapping];

            return (
              <div
                key={index}
                className="px-2 py-2"
              >
                <button
                  onClick={() => {
                    // Se não estiver colapsado, toggle no clique
                    if (!isCollapsed) handleToggleSubmenu(index);
                  }}
                  onMouseEnter={() => {
                    // Se colapsado, abre submenu ao passar o mouse
                    if (isCollapsed) handleToggleSubmenu(index);
                  }}
                  onMouseLeave={() => {
                    // Se colapsado, fecha ao sair
                    if (isCollapsed) handleToggleSubmenu(index);
                  }}
                  className={`flex items-center w-full gap-2 p-2 rounded-lg ${theme.sidebar.hover} ${theme.transition}`}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  {!isCollapsed && <span>{menu.title}</span>}
                </button>

                {/* Submenu */}
                <div
                  className={`
                    ${openSubmenus[index] ? "max-h-96" : "max-h-0"}
                    overflow-hidden z-50 ${theme.transition}
                  `}
                >
                  {menu.children.map((child, childIndex) => (
                    <Link
                      key={childIndex}
                      href={child.href}
                      className={`
                        block pl-8 pr-2 py-2 text-sm
                        ${pathname === child.href ? theme.sidebar.active : ""}
                        hover:${theme.sidebar.hover} rounded-lg
                      `}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          }

          // Se for um menu normal (com items)
          return (
            <div
              key={index}
              className="mt-4"
            >
              {/* Título do bloco */}
              {!isCollapsed && (
                <span className="block text-gray-400 font-light px-4 mb-2">
                  {menu.title}
                </span>
              )}
              <ul>
                {menu.items?.map((item, itemIndex) => {
                  const IconComponent =
                    iconMapping[item.icon as keyof typeof iconMapping];
                  if (!item.visible.includes(role)) return null;

                  return (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-2 p-2 mx-2 my-1 rounded-lg
                          ${pathname === item.href ? theme.sidebar.active : ""}
                          ${theme.sidebar.hover} ${theme.transition}
                          justify-center lg:justify-start
                        `}
                      >
                        {IconComponent && <IconComponent className="h-5 w-5" />}
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Rodapé com botão de colapsar/expandir */}
      <div className="p-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full p-2 rounded-lg text-center ${theme.sidebar.hover}`}
        >
          {isCollapsed ? ">>" : "<< Colapsar"}
        </button>
      </div>
    </div>
  );
};

export default Menu;
