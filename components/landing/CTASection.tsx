import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Check } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="backdrop-blur-xl border border-slate-200 rounded-3xl p-12"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(0, 127, 143, 0.1), rgba(0, 163, 184, 0.1))",
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Sales?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Start your 14-day free trial. No credit card required. Cancel
            anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="group px-8 py-4 rounded-xl font-semibold text-lg text-white hover:opacity-90 transition-all shadow-2xl"
              style={{
                background: "#007f8f",
                boxShadow: "0 20px 60px rgba(0, 127, 143, 0.3)",
              }}
            >
              <Link href="/register">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 rounded-xl font-semibold text-lg"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-slate-600 mt-6">
            Join hundreds of businesses already using KONFIGRA
          </p>
        </div>
      </div>
    </section>
  );
}
