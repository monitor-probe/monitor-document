import { useEffect, useRef } from "react"
import { nav } from "@/nav"
import { A } from "@/lib/router"
import { cn } from "@/lib/utils"

export function Sidebar({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  // The list is taller than a 1080p viewport, so a page near the end would
  // otherwise open with its own entry scrolled out of sight. Only the sidebar's
  // own box is scrolled, never the window, and only when the entry is hidden, so
  // a click inside the list does not move the list under the pointer.
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const box = ref.current?.parentElement
    const a = ref.current?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!box || !a) return
    const top = a.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop
    if (top < box.scrollTop || top + a.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTop = top - box.clientHeight / 2
    }
  }, [path])
  return (
    <nav ref={ref} className="space-y-7 text-sm">
      {nav.map((section) => (
        <div key={section.title}>
          <p className="mb-2.5 px-3 text-xs font-medium tracking-wide text-muted-foreground">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.path}>
                <A
                  to={item.path}
                  onClick={onNavigate}
                  aria-current={item.path === path ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-1.5 transition-colors",
                    item.path === path
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  {item.label}
                </A>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
