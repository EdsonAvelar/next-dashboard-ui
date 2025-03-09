// app/components/ClientLayout.tsx
"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function ClientLayout() {
  return (
    <>
      {/* Sidebar fixa à esquerda */}
      <div className="fixed top-0 left-0 bottom-0 w-64 bg-white z-40">
        <Sidebar />
      </div>

      {/* Navbar fixa no topo, alinhada à direita da sidebar */}
      <div className="fixed top-0 left-64 right-0 h-16 bg-white z-30 shadow-sm flex items-center">
        <Navbar />
      </div>
    </>
  );
}
