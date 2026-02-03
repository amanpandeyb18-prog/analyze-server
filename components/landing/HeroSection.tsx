import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Check, TrendingUp, Zap } from "lucide-react";
import Script from "next/script";
import { env } from "@/src/config/env";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-full mb-8 backdrop-blur-sm"
            style={{
              background: "rgba(0, 127, 143, 0.1)",
              borderColor: "rgba(0, 127, 143, 0.3)",
            }}
          >
            <Zap className="w-4 h-4" style={{ color: "#007f8f" }} />
            <span className="text-sm font-medium" style={{ color: "#007f8f" }}>
              Save 80% of time on quotes
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            Build Custom Products
            <span
              className="block"
              style={{
                background: "linear-gradient(to right, #007f8f, #00a3b8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Smarter, Faster
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Let customers configure products themselves. See real-time pricing.
            Get instant quotes. Close deals automatically while you focus on
            what matters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href={"/register"}
              className="group px-8 py-4 rounded-xl font-semibold text-lg text-white hover:opacity-90 transition-all shadow-2xl flex items-center justify-center gap-2"
              style={{
                background: "#007f8f",
                boxShadow: "0 20px 60px rgba(0, 127, 143, 0.3)",
              }}
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={"/#demo"}
              className="px-8 py-4 bg-white border border-slate-300 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all"
            >
              Watch Demo
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: "#007f8f" }}
              >
                80%
              </div>
              <div className="text-sm text-slate-600">Time Saved</div>
            </div>
            <div className="text-center">
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: "#00a3b8" }}
              >
                316%
              </div>
              <div className="text-sm text-slate-600">More Leads</div>
            </div>
            <div className="text-center">
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: "#00c7d1" }}
              >
                28%
              </div>
              <div className="text-sm text-slate-600">Conversion Rate</div>
            </div>
          </div>
        </div>

        {/* Product Preview */}
        <div
          id="#demo"
          className="mt-6 border rounded-lg overflow-hidden shadow-sm"
        >
          <div id="konfigra-cmk9fm7dw0003if04l6010t8j"></div>
        </div>
        <Script
          src={env.NEXT_PUBLIC_EMBED_URL + "/embed/script.js"}
          strategy="afterInteractive"
          data-public-key="cmk9famc10002l704mgftosif"
          data-configurator-id="cmk9fm7dw0003if04l6010t8j"
          data-container-id="konfigra-cmk9fm7dw0003if04l6010t8j"
        />
      </div>
    </section>
  );
}
