import { Zap } from "lucide-react";
import ui from "../locales/bg/ui.json";
import { format } from "../locales/format";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row">
        <div className="flex items-center gap-2 font-display text-sm font-black uppercase text-white">
          <Zap className="h-4 w-4 fill-accent text-accent" />
          {ui.brand.lead}
          <span className="text-accent">/</span>
          {ui.brand.mark}
        </div>
        <p className="hud-label">{format(ui.footer.tagline, { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
