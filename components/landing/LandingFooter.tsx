import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import Logo from "../logo";

export function LandingFooter() {
  return (
    <footer className="py-12 px-6 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <div className="flex gap-8 text-slate-600">
            <a href="#" className="hover:text-slate-900 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Support
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Contact
            </a>
          </div>
          <div className="text-slate-600 text-sm">
            © 2024 KONFIGRA. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
