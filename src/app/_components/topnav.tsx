import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function TopNav({}: Readonly<{}>) {
  return (
    <nav className="flex items-center justify-between w-full p-4 text-xl font-semibold bg-lime-800">
      <div>Whispering Willow Diary</div>
      
      <div className="flex gap-4 align-center">
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
