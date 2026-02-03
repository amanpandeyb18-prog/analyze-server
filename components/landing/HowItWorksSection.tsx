import { Card } from "@/components/ui/card";
import { Code, Rocket, Wrench } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get Live in 30 Minutes
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Three simple steps to transform your sales process. No developers
            needed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              number: "01",
              icon: Wrench,
              time: "10 min",
              title: "Build Your Configurator",
              description:
                "Use our visual builder to create your product configurator. Add options, set prices, define rules. No coding required - just point, click, and configure.",
            },
            {
              number: "02",
              icon: Code,
              time: "5 min",
              title: "Embed on Your Site",
              description:
                "Copy one line of code and paste it anywhere on your website. Works with WordPress, Shopify, custom sites. Matches your brand automatically.",
            },
            {
              number: "03",
              icon: Rocket,
              time: "12 min",
              title: "Test & Launch",
              description:
                "Try it out, tweak the settings, and go live. Start receiving quote requests immediately. Your customers configure, you close deals.",
            },
          ].map((step, i) => (
            <div key={i} className="relative group">
              {/* Connector line */}
              {i < 2 && (
                <div
                  className="hidden md:block absolute top-20 left-[60%] w-[80%] h-0.5"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(0, 127, 143, 0.5), transparent)",
                  }}
                />
              )}

              <div className="bg-white border border-slate-200 rounded-xl p-8 h-full hover:shadow-xl transition-all duration-300 hover:border-slate-300">
                <div className="mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg text-white"
                    style={{
                      background:
                        "linear-gradient(to bottom right, #007f8f, #00a3b8)",
                    }}
                  >
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <div
                      className="text-6xl font-bold"
                      style={{ color: "rgba(0, 127, 143, 0.2)" }}
                    >
                      {step.number}
                    </div>
                    <div className="text-sm font-semibold text-green-600 bg-green-500/10 px-2 py-1 rounded">
                      {step.time}
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold mb-3 text-slate-900">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div
            className="inline-block p-6 rounded-xl border"
            style={{
              background:
                "linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(0, 127, 143, 0.1))",
              borderColor: "rgba(34, 197, 94, 0.2)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-green-600">
                Total: 27 min
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-900">
                  From zero to live
                </div>
                <div className="text-sm text-slate-600">
                  Start generating quotes immediately
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
