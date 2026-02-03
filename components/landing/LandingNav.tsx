import Link from "next/link";
import Image from "next/image";
import UserWidget from "@/components/user-widget";
import Logo from "../logo";

export function LandingNav() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            Features
          </a>
          <a
            href="/pricing"
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            Pricing
          </a>
          <UserWidget />
        </div>
      </div>
    </nav>
  );
}
