import { getMyEntries } from "~/server/queries";
import AppInitializer from "../appinitializer";
import SideBar from "./_components/sidebar";

export default async function DiaryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const entries = await getMyEntries()

  return (
    <AppInitializer entries={entries}>
      <SideBar />
      {children}
    </AppInitializer>
  )
}