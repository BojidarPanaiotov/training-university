import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";
import ui from "../locales/bg/ui.json";

const links = [
  { to: "/#programs", label: ui.nav.programs },
  { to: "/#stories", label: ui.nav.results },
  { to: "/about", label: ui.nav.about },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-white/15 bg-ink-950/95 backdrop-blur-xl" : "border-white/10 bg-ink-950/80 backdrop-blur-xl"
      }`}
    >
      <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5" aria-label={ui.nav.label}>
        <Link to="/" onClick={close} className="group flex shrink-0 items-center gap-2.5">
          <span className="chamfer grid h-10 w-10 place-items-center bg-accent transition group-hover:bg-white">
            <Zap className="h-5 w-5 fill-ink-950 text-ink-950" />
          </span>
          <span className="font-display text-lg font-black uppercase tracking-tight text-white">
            {ui.brand.lead}
            <span className="text-accent">/</span>
            {ui.brand.mark}
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-4 py-2.5 text-base font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {item.label}
            </Link>
          ))}
          <Link to="/#programs" className="btn-primary ml-2 !px-5 !py-2.5 !text-sm">
            {ui.nav.startNow}
          </Link>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-md border border-white/20 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? ui.nav.closeMenu : ui.nav.openMenu}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div id="site-menu" className="border-t border-white/10 bg-ink-950 px-5 py-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={close}
                className="rounded-md px-3 py-3 text-lg font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/#programs" onClick={close} className="btn-primary mt-2 !text-sm">
              {ui.nav.startNow}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
