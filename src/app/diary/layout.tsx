import AppInitializer from "../appinitializer";
import SideBar from "./_components/sidebar";

export default function DiaryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppInitializer entries={{}}>
      <SideBar />
      <div className="ml-10">
        {children}
      </div>
    </AppInitializer>
  )
}