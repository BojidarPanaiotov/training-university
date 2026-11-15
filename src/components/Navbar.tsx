import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import ui from "../locales/bg/ui.json";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-white/10 bg-ink-950/75 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="chamfer grid h-9 w-9 place-items-center bg-accent transition group-hover:bg-white">
            <Zap className="h-5 w-5 fill-ink-950 text-ink-950" />
          </span>
          <span className="font-display text-sm font-black uppercase tracking-tight text-white sm:text-base">
            {ui.brand.lead}
            <span className="text-accent">/</span>
            {ui.brand.mark}
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/#programs" className="hud-label hidden px-4 py-2 hover:!text-white sm:inline">
            {ui.nav.programs}
          </Link>
          <Link to="/#stories" className="hud-label hidden px-4 py-2 hover:!text-white sm:inline">
            {ui.nav.results}
          </Link>
          <Link to="/#programs" className="btn-primary !px-4 !py-2 !text-xs">
            {ui.nav.startNow}
          </Link>
        </div>
      </nav>
    </header>
  );
}
