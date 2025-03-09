import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ToastContainer } from "react-toastify";

import "react-toastify/ReactToastify.css";

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
    <html lang="en">
      <body className={inter.className}>
        <div className="h-screen flex">
          {/* Coluna Esquerda */}
          <Sidebar />

          {/* Coluna Direita: flex-1 expande para ocupar todo o espaço restante */}
          <div className="flex-1 bg-[#F7F8FA] overflow-y-auto">
            <Navbar />

            {children}
          </div>
        </div>
        <ToastContainer
          position="bottom-right"
          theme="colored"
        />
      </body>
    </html>
  );
}
