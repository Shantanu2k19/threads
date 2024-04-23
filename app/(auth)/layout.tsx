// This layout will be applied only for auth subgroup

import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import '../globals.css'
import React from 'react'

// This for SEO
export const metadata = {
  title: 'Threads',
  description: 'A next js 13 threads clone for learning mern'
}

const inter = Inter({ subsets: ['latin'] })

// props (children) and type of prop (React.reactNode)
export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    <div className='w-full flex justify-center items-center min-h-screen'>
                      {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
  )
}
