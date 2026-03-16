export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-chl-dark/90 backdrop-blur-md border-b border-chl-border">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="https://clickherelabs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-lg bg-chl-teal flex items-center justify-center font-black text-chl-dark text-sm group-hover:bg-chl-teal-light transition-colors">
            CHL
          </div>
          <div className="leading-tight">
            <p className="text-white font-bold text-sm leading-none">Click Here Labs</p>
            <p className="text-chl-muted text-xs">Site Analyzer</p>
          </div>
        </a>

        {/* Right side */}
        <a
          href="https://clickherelabs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-chl-teal hover:text-chl-teal-light transition-colors"
        >
          Get Expert Help
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </header>
  )
}
