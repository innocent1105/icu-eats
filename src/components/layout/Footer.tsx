export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-muted py-8 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
        <span>© {new Date().getFullYear()} ICU Eats. All rights reserved.</span>
        <div className="flex gap-4">
          <a className="hover:text-text">Privacy</a>
          <a className="hover:text-text">Terms</a>
          <a className="hover:text-text">Help</a>
        </div>
      </div>
    </footer>
  )
}
