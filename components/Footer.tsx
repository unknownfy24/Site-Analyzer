export default function Footer() {
  return (
    <footer className="border-t border-chl-border bg-chl-dark py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-chl-teal flex items-center justify-center font-black text-chl-dark text-xs">
            CHL
          </div>
          <span className="text-chl-muted text-sm">
            © {new Date().getFullYear()} Click Here Labs. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <a
            href="https://clickherelabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-chl-muted hover:text-chl-teal transition-colors"
          >
            clickherelabs.com
          </a>
          <span className="text-chl-border">|</span>
          <span className="text-chl-muted">
            Powered by{' '}
            <a
              href="https://developer.chrome.com/docs/lighthouse/overview/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chl-teal hover:text-chl-teal-light transition-colors"
            >
              Google Lighthouse
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
