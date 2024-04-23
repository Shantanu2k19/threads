import React from 'react'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from "@clerk/themes";

import LeftSidebar from '@/components/shared/Lefisidebar'
import Rightsidebar from '@/components/shared/Rightsidebar'
import Topbar from '@/components/shared/Topbar'
import Bottombar from '@/components/shared/Bottombar'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Threads',
  description: 'A next js 13 threads clone for learning mern'
}

export default function RootLayout ({
  children
  //({ children }): This is known as object destructuring in JavaScript. 
  //It extracts the children property from the object passed as an argument to the function.
}: Readonly<{
  children: React.ReactNode  
  //Readonly<{}>: This is a TypeScript utility type that creates an immutable version of an object. 
  //It ensures that the properties of the object cannot be modified after creation.
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <Topbar />
            <main className="flex flex-row">
              <LeftSidebar />

              <section className="main-container">
                <div className="w-full max-w-4xl">
                  {children}
                </div>
              </section>

              <Rightsidebar />
            </main>

          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  )
}
