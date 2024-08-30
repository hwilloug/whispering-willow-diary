import SideBar from "./_components/sidebar"

export default function DiaryLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SideBar />
      <div className="ml-10">{children}</div>
    </>
  )
}
