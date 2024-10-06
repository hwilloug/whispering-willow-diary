"use client"

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth
} from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function TopNav() {
  const pathname = usePathname()
  return (
    <nav className="flex items-center justify-between w-full p-4 text-xl bg-[#436228]">
      <div className="flex items-center gap-2">
        <img className="w-14" src="/whispering_willow_logo.png" alt="logo" />
        <div className="font-dancing-script text-[#e0f0bb] text-3xl">
          <Link href="/">Whispering Willow Diary</Link>
        </div>
        <div className="text-red-400 text-sm border rounded-full p-2 border-red-400">
          Alpha
        </div>
      </div>

      <div className="flex gap-4 align-center font-sans">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          {pathname === "/" && (
            <nav className="text-[--primary]">
              <Link href="/diary/dashboard">Dashboard</Link>
            </nav>
          )}
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}
