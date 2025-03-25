"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useWindowSize } from "@/hooks/useWindowSize";
import { getCurrentUser, UserProfile } from "@/lib/actions";
import { getSidenavItems } from "@/lib/sidenavItems";
import { usePathname } from "next/navigation";
import { toPath } from "@/lib/utils";

// Função debounce: aguarda um delay antes de executar a função
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

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
  // const menuData = getSidenavItems(user?.id);

  const menuData = useMemo(() => getSidenavItems(user?.id), [user?.id]);

  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Em vez de um objeto, controlamos qual menu (índice) está aberto
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  // Usa o hook customizado para monitorar o tamanho da janela
  const { width } = useWindowSize();

  // Atualiza isCollapsed sempre que a largura muda
  useEffect(() => {
    if (width < 1000) {
      setIsCollapsed(true);
    }
  }, [width]);

  // Ao trocar o submenu, fecha os outros
  const toggleSubmenu = (idx: number) => {
    setOpenSubmenu((prev) => (prev === idx ? null : idx));
  };

  // Cria uma versão debounced da função de atualização do estado de hover (200ms de atraso)
  const debouncedSetHovered = useMemo(() => debounce(setIsHovered, 200), []);

  const handleMouseEnter = () => {
    if (isCollapsed) {
      debouncedSetHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (isCollapsed) {
      debouncedSetHovered(false);
    }
  };

  return (
    <div
      className={`h-full mt-[50px] relative flex-shrink-0 transition-all duration-300 delay-200 ease-in-out hidden md:block ${
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
                const active = pathname.startsWith(menu.prefix)
                  ? "bg-gray-200"
                  : "";
                const isOpen = openSubmenu === idx;
                const ArrowIcon = isOpen ? ChevronDownIcon : ChevronRightIcon;
                return (
                  <div
                    key={idx}
                    className="relative px-2 py-2"
                  >
                    <button
                      onClick={() => toggleSubmenu(idx)}
                      className={`${active} flex items-center w-full gap-2 p-2 rounded-md hover:bg-gray-100 rounded-r-full transition-colors`}
                    >
                      {menu.icon && <menu.icon className="h-5 w-5" />}
                      <span
                        className={`flex-1 text-left overflow-hidden whitespace-nowrap ${
                          menu.children[0].href === pathname
                            ? "hover:bg-gray-100 rounded-r-full px-2"
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
                      {menu.children.map((child, cIdx) => {
                        const finalpath = toPath(menu.prefix, child.href);
                        return (
                          <>
                            <div className=" space-y-1  gap-y-2  pb-1 pt-1">
                              <div
                                className={`flex justify-start gap-1 pl-5  gap-y-2 ${
                                  finalpath === pathname
                                    ? "bg-gradient-to-r from-purple-300 to-purple-600 rounded-r-full text-white"
                                    : "hover:bg-gray-100 rounded-r-full"
                                } `}
                              >
                                <span className="menu-item flex items-center"></span>
                                <Link
                                  key={cIdx}
                                  href={
                                    finalpath +
                                    ("params" in child && child.params
                                      ? `?${child.params}`
                                      : "")
                                  }
                                  className={`block w-full p-1 text-md transition-colors  gap-y-2`}
                                >
                                  {/* {child.label} */}
                                  {/* <span className="inline-block w-3 h-3 border border-gray-500 rounded-full mr-2"></span> */}

                                  {child.label}
                                </Link>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            })}
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
      ) : (
        // <div className="absolute inset-0 z-50  bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden shadow-lg ">

        <div className="w-full h-full bg-white border-r border-gray-200 transition-all duration-200 ease-in-out overflow-hidden shadow-lg">
          <div className="h-[80%] items-center flex flex-col justify-start">
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
