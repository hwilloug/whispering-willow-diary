import "~/styles/globals.css";

import { type Metadata } from "next";
import TopNav from "./_components/topnav";
import { ClerkProvider } from "@clerk/nextjs";
import { Footer } from "./_components/footer";

export const metadata: Metadata = {
  title: "Whispering Willow Diary",
  description: "A journaling and mood tracking website created by Hannah Willoughby",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
  );
}
