"use client"

import { SignInButton, SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";

export default function TopNav({}: Readonly<{}>) {
  const user = useAuth()

  return (
    <nav className="flex items-center justify-between w-full p-4 text-xl bg-primary-main">
      <div className="flex items-center gap-2">
        <img className="w-14" src="/whispering_willow_logo.png" />
        <div className="font-dancing-script text-primary-light text-3xl">Whispering Willow Diary</div>
        <div className="text-blue-400 text-sm border rounded-full p-2 border-blue-400">Beta</div>
      </div>
      
      <div className="flex gap-4 align-center font-sans">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
