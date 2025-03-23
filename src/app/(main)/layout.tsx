import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/Sidebar";
import { ToastContainer } from "react-toastify";

import "react-toastify/ReactToastify.css";
import Header from "@/components/Header";
import HeaderMobile from "@/components/HeaderMobile";
import NavbarContainer from "@/components/containers/NavbarContainer";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lama Dev School Management Dashboard",
  description: "Next.js School Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={`${inter.className} overflow-hidden`}>
        <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow">
          {/* Conteúdo do header */}
          <nav>
            <Header />
            <HeaderMobile />
          </nav>
        </header>

        <div className="h-screen flex">
          {/* Coluna Esquerda */}
          <Sidebar />

          {/* Coluna Direita: flex-1 expande para ocupar todo o espaço restante */}
          <div className="flex-1 bg-[#F7F8FA] overflow-y-auto mt-[50px]">
            {/* <Navbar /> */}

            {children}
          </div>
        </div>

        <ToastContainer
          position="top-right"
          theme="colored"
        />
      </body>
    </html>

    // <html lang="en">
    //   <body className={inter.className}>
    //     <div className="h-screen flex">
    //       {/* Coluna Esquerda */}
    //       <Sidebar />

    //       {/* Coluna Direita: flex-1 expande para ocupar todo o espaço restante */}
    //       <div className="flex-1 bg-[#F7F8FA] overflow-y-auto">
    //         <Navbar />

    //         {children}
    //       </div>
    //     </div>
    //     <ToastContainer
    //       position="bottom-right"
    //       theme="colored"
    //     />
    //   </body>
    // </html>
  );
}
