import { Card } from "@/components/ui/card";
import {
  Users,
  Star,
  Quote,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
} from "lucide-react";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-6 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Loved by Businesses
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real results from real customers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote:
                "KONFIGRA transformed our sales process. Quote turnaround time reduced by 80%. We've seen a 316% increase in quote requests and our conversion rate doubled. Best €999 I've ever spent.",
              author: "Sarah Chen",
              role: "CEO, TechBuild Co",
              results: [
                "80% time saved",
                "316% more leads",
                "2x conversion rate",
              ],
            },
            {
              quote:
                "The embed feature is seamless. Our conversion rate increased 45% since we added the configurator to our product pages. Customers love seeing their custom sofa come to life.",
              author: "Marcus Weber",
              role: "Founder, FurnitureHub",
              results: ["45% conversion increase", "32% higher order value"],
            },
            {
              quote:
                "Best investment we've made this year. The analytics help us understand what customers want, and the quote automation saves hours daily. Our engineering team can focus on actual engineering.",
              author: "Priya Patel",
              role: "Operations Director, CustomParts Inc",
              results: ["80% time saved", "Eliminated manual errors"],
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-8"
            >
              <p className="text-slate-700 mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ background: "#007f8f" }}
                >
                  {testimonial.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-slate-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-slate-200">
                {testimonial.results.map((result, j) => (
                  <div
                    key={j}
                    className="text-sm flex items-center gap-2"
                    style={{ color: "#007f8f" }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {result}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
