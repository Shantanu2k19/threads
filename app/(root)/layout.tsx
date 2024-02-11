import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs"


import LeftSidebar from "@/components/shared/Lefisidebar";
import Rightsidebar from "@/components/shared/Rightsidebar";
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Threads',
  description : 'A next js 13 threads clone for learning mern'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Topbar />
            <main>
              <LeftSidebar />

              <section className="main-container">
                <div className="w-full max-w-4xl">
                  {children}
                </div>
              </section>

              <Rightsidebar />
            </main>
          {children}
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
} 

