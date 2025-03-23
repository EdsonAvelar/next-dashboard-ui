"use client";

import React from "react";

import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import InputSearch from "./InputSearch";

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const pathname = usePathname();

  // Define uma variável tools, que renderiza botões específicos dependendo do path.
  let tools = null;
  if (pathname.includes("/pipeline")) {
    tools = (
      <InputSearch />
      // <div className="flex space-x-2 items-center">
      //   <button
      //     className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
      //     onClick={() => {
      //       // Lógica para abrir modal ou redirecionamento para adicionar novo negócio no pipeline.
      //       console.log("Adicionar novo negócio no pipeline");
      //     }}
      //   >
      //     Add++
      //   </button>
      // </div>
    );
  }

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`,
        {
          "border-b border-gray-200 bg-white/75 backdrop-blur-lg": scrolled,
          "border-b border-gray-200 bg-white": selectedLayout,
        }
      )}
    >
      <div className="flex h-[47px] items-center justify-between px-4 bg-zync-300">
        <div className="flex items-center space-x-4 hidden md:block">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center "
          >
            <span className="h-7 w-7 bg-amber-950 rounded-lg" />
            <span className="font-bold text-xl flex ">Logo</span>
          </Link>
        </div>

        <div className="">{tools}</div>

        <div className="hidden md:block">
          <div className="h-8 w-8 rounded-full bg-zync-300 flex items-center justify-center text-center">
            <span className="font-semibold text-sm">HQ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
