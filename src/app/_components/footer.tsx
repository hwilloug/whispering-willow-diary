export function Footer() {
  return (
    <div className="w-full bg-lime-900 p-6 text-lime-200 text-center">
      <div>&copy; {new Date().getFullYear()} Whispering Willow Diary</div>
      <div className="pt-2">
        <a href="https://www.buymeacoffee.com/hannahjanew">
          <button className="bg-orange-600 p-3 rounded-lg">
            Buy me a coffee
          </button>
        </a>
      </div>
    </div>
  )
}