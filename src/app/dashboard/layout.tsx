import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

import Link from 'next/link';
import Image from 'next/image';
import Menu from '@/components/Menu';
import Navbar from '@/components/Navbar';



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lama Dev School Management Dashboard",
  description: "Next.js School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      <body className={inter.className}>

        <div className="h-screen flex">

          {/* Left */}
          <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-white">

            <Link href="/" className='flex items-center justify-center lg:justify-start p-4 gap-2'>

              <Image src="/logo.png" alt="logo" width={32} height={32} />
              <span className='hidden lg:block font-bold'>SchoolLama</span>

            </Link>
            <Menu />
          </div>
          {/* Right */}
          <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
            <Navbar />
            {children}
          </div>
        </div>


      </body>
    </html>

  );
}
