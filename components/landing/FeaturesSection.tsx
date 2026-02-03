import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Zap,
  BarChart3,
  Smartphone,
  Globe,
  Shield,
  TrendingUp,
} from "lucide-react";
export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features that transform how you sell configurable products
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Visual Builder",
              description:
                "Create configurators in 20 minutes. No code required. Just drag, drop, and configure.",
            },
            {
              icon: <DollarSign className="w-8 h-8" />,
              title: "Smart Pricing",
              description:
                "Real-time price calculations with conditional rules, formulas, and quantity discounts.",
            },
            {
              icon: <Globe className="w-8 h-8" />,
              title: "Embed Anywhere",
              description:
                "One line of code. Works on any website. WordPress, Shopify, custom sites.",
            },
            {
              icon: <Clock className="w-8 h-8" />,
              title: "Instant Quotes",
              description:
                "Customers get PDF quotes in 30 seconds. Your team gets instant notifications.",
            },
            {
              icon: <CheckCircle2 className="w-8 h-8" />,
              title: "Smart Rules",
              description:
                "Set compatibility rules, dependencies, and constraints to prevent invalid configs.",
            },
            {
              icon: <BarChart3 className="w-8 h-8" />,
              title: "Analytics Dashboard",
              description:
                "Track views, conversions, popular options, and revenue. Make data-driven decisions.",
            },
            {
              icon: <Smartphone className="w-8 h-8" />,
              title: "Mobile-First",
              description:
                "Perfect on every device. Desktop, tablet, mobile. Responsive and touch-optimized.",
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "White-Label",
              description:
                "Your brand, your colors, your fonts. Remove KONFIGRA branding on premium plans.",
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: "ROI Tracking",
              description:
                "See exactly how much revenue your configurators generate. Prove your investment.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-all hover:shadow-xl"
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{
                  background: "rgba(0, 127, 143, 0.1)",
                  color: "#007f8f",
                }}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
