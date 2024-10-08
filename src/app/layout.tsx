"use client"

import "~/styles/globals.css"

import TopNav from "./_components/topnav"
import { ClerkProvider } from "@clerk/nextjs"
import { Footer } from "./_components/footer"
import { trpc } from "~/utils/trpc"

function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className="overscroll-none">
        <body>
          <div className="min-h-screen grid grid-rows-[auto,1fr,auto]">
            <TopNav />
            <main>{children}</main>
          </div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}

export default trpc.withTRPC(RootLayout)
