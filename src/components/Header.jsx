export default function Header() {
  return (
    <header className="border-b border-zinc-800 px-6 md:px-10 py-4 flex items-center justify-between shrink-0">
      <div>
        <span className="text-white font-semibold tracking-tight text-base">BurgerBarn</span>
        <span className="text-zinc-600 mx-2">·</span>
        <span className="text-zinc-500 text-sm">Strategic Roadmap</span>
      </div>
      <span className="text-zinc-600 text-xs uppercase tracking-widest font-medium">Partners</span>
    </header>
  )
}
