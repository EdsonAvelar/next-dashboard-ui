"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useWindowSize } from "@/hooks/useWindowSize";
import { getCurrentUser, UserProfile } from "@/lib/actions";
import { getSidenavItems } from "@/lib/sidenavItems";
import { usePathname } from "next/navigation";

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

  // Pega os itens do menu usando o usuário (se disponível)
  const menuData = getSidenavItems(user?.id);
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<number, boolean>>({});

  // Usa o hook customizado para monitorar o tamanho da janela
  const { width } = useWindowSize();

  // Atualiza isCollapsed sempre que a largura muda
  useEffect(() => {
    if (width < 1000) {
      setIsCollapsed(true);
    }
  }, [width]);

  const toggleSubmenu = (idx: number) => {
    setOpenSubmenus((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleMouseEnter = () => {
    if (isCollapsed) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (isCollapsed) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 200); // atraso de 200ms para suavizar a transição
    }
  };

  return (
    <div
      className={`h-full mt-[50px]  relative flex-shrink-0 transition-all duration-300 delay-200  ease-in-out hidden md:block ${
        isCollapsed ? "w-16" : "w-[13rem]"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isCollapsed || isHovered ? (
        <div className="absolute inset-0 z-50 w-[13rem] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden shadow-lg ">
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
                      className="flex items-center w-full gap-2 p-2 rounded-md hover:bg-purple-100 transition-colors"
                    >
                      {menu.icon && <menu.icon className="h-5 w-5" />}
                      <span
                        className={`flex-1 text-left overflow-hidden whitespace-nowrap ${
                          // Se o menu estiver ativo (verifica o primeiro href dos filhos)
                          menu.children[0].href === pathname
                            ? "bg-purple-200 rounded-r-full px-2"
                            : ""
                        }`}
                      >
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
                            ("params" in child && child.params
                              ? `?${child.params}`
                              : "")
                          }
                          className={`block pl-8 pr-2 py-2 text-sm transition-colors ${
                            child.href === pathname
                              ? "bg-purple-100 rounded-r-full "
                              : "hover:bg-purple-100"
                          }`}
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
        // Aqui ele volta rápido se o duration for 100
        <div className="w-full bg-white border-r border-gray-200 transition-all duration-100 ease-in-out overflow-hidden">
          {/* <div className="p-4">
            <span className="block font-bold">LOGO</span>
          </div> */}
          <div className="flex flex-col items-center ">
            {menuData.map((menu, idx) => (
              <div
                key={idx}
                className="p-2"
              >
                {menu.icon && <menu.icon className="h-5 w-5" />}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-gray-200 ">
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
