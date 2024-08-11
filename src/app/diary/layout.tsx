import { getMyEntries } from "~/server/queries";
import AppInitializer from "../appinitializer";

export default async function DiaryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const entries = await getMyEntries()

  return (
    <AppInitializer entries={entries}>
      {children}
    </AppInitializer>
  )
}