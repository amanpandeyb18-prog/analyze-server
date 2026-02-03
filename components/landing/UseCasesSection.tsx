import { Card } from "@/components/ui/card";
import { Check, CheckCircle2 } from "lucide-react";

export function UseCasesSection() {
  return (
    <section className="py-20 px-6 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Perfect For</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Industries and businesses transforming their sales process with
            KONFIGRA
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "B2B Manufacturing",
              examples: [
                "Industrial Equipment",
                "Custom Machinery",
                "Technical Components",
                "Made-to-Order Products",
              ],
              result: "80% reduction in quote time",
            },
            {
              title: "E-commerce",
              examples: [
                "Custom Furniture",
                "Personalized Products",
                "Build-Your-Own Kits",
                "Multi-Variant Items",
              ],
              result: "45% conversion increase",
            },
            {
              title: "Professional Services",
              examples: [
                "Software Packages",
                "Service Bundles",
                "Solution Configurators",
                "Pricing Calculators",
              ],
              result: "2x faster sales cycles",
            },
          ].map((useCase, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-8"
            >
              <h3
                className="text-2xl font-bold mb-4"
                style={{
                  background: "linear-gradient(to right, #007f8f, #00a3b8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {useCase.title}
              </h3>
              <ul className="space-y-2 mb-6">
                {useCase.examples.map((example, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-2 text-slate-700"
                  >
                    <CheckCircle2
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "#007f8f" }}
                    />
                    {example}
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-slate-200">
                <p className="font-semibold" style={{ color: "#007f8f" }}>
                  {useCase.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
