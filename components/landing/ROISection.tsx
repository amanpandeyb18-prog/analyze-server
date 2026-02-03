import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export function ROISection() {
  return (
    <section className="py-24 px-6 bg-white/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-full mb-6 text-sm font-medium"
            style={{
              background: "rgba(34, 197, 94, 0.1)",
              borderColor: "rgba(34, 197, 94, 0.2)",
              color: "#16a34a",
            }}
          >
            <DollarSign className="w-4 h-4" />
            Proven ROI
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The Numbers Don't Lie
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Real ROI from Sarah's business in the first year after implementing
            KONFIGRA
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Before */}
          <div
            className="p-8 border-2 rounded-xl"
            style={{
              borderColor: "rgba(239, 68, 68, 0.2)",
              background: "rgba(239, 68, 68, 0.05)",
            }}
          >
            <h3 className="text-2xl font-bold mb-6 text-red-600">
              Before KONFIGRA
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-600">Quote requests/month</span>
                <span className="font-bold text-slate-900">45</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-600">Response time</span>
                <span className="font-bold text-slate-900">2-3 days</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-600">Conversion rate</span>
                <span className="font-bold text-slate-900">12%</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-600">Labor time</span>
                <span className="font-bold text-slate-900">60 hours/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Annual cost</span>
                <span className="font-bold text-red-600">€320,000+</span>
              </div>
            </div>
          </div>

          {/* After */}
          <div
            className="p-8 border-2 rounded-xl"
            style={{
              borderColor: "rgba(34, 197, 94, 0.2)",
              background: "rgba(34, 197, 94, 0.05)",
            }}
          >
            <h3 className="text-2xl font-bold mb-6 text-green-600">
              After KONFIGRA
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-600">Quote requests/month</span>
                <span className="font-bold text-slate-900">
                  187 <span className="text-green-600 text-sm">(+316% ↗)</span>
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-600">Response time</span>
                <span className="font-bold text-slate-900">
                  30 seconds{" "}
                  <span className="text-green-600 text-sm">(instant ⚡)</span>
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-600">Conversion rate</span>
                <span className="font-bold text-slate-900">
                  28% <span className="text-green-600 text-sm">(+133% ↗)</span>
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-600">Labor time</span>
                <span className="font-bold text-slate-900">
                  5 hours/month{" "}
                  <span className="text-green-600 text-sm">(-92% ↘)</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Additional revenue</span>
                <span className="font-bold text-green-600">€350,000+</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Calculation */}
        <div
          className="p-8 rounded-xl border"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(0, 127, 143, 0.1), rgba(0, 163, 184, 0.1))",
            borderColor: "rgba(0, 127, 143, 0.2)",
          }}
        >
          <h3 className="text-2xl font-bold mb-6 text-center text-slate-900">
            ROI Breakdown
          </h3>
          <div className="space-y-4 mb-8">
            {[
              {
                category: "Labor Cost Savings",
                before: "60 hours/month",
                after: "5 hours/month",
                savings: "€20,000",
              },
              {
                category: "Increased Conversions",
                before: "12% conversion",
                after: "28% conversion",
                savings: "€200,000",
              },
              {
                category: "More Quote Requests",
                before: "45 requests/month",
                after: "187 requests/month",
                savings: "€150,000",
              },
              {
                category: "Error Reduction",
                before: "15% error rate",
                after: "0% error rate",
                savings: "€10,000",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-white/70 rounded-lg"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    {item.category}
                  </div>
                  <div className="text-sm text-slate-600">
                    {item.before} → {item.after}
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {item.savings}
                </div>
              </div>
            ))}
          </div>
          <div
            className="border-t-2 pt-6"
            style={{ borderColor: "rgba(0, 127, 143, 0.2)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  KONFIGRA Cost
                </div>
                <div className="text-sm text-slate-600">Yearly plan</div>
              </div>
              <div className="text-2xl font-bold text-slate-900">€999/year</div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  Total Benefit
                </div>
                <div className="text-sm text-slate-600">Savings + Revenue</div>
              </div>
              <div className="text-2xl font-bold text-green-600">€380,000+</div>
            </div>
            <div
              className="flex items-center justify-between rounded-lg p-6"
              style={{ background: "rgba(0, 127, 143, 0.2)" }}
            >
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  Return on Investment
                </div>
                <div className="text-sm text-slate-600">
                  Break-even in 1 day
                </div>
              </div>
              <div className="text-5xl font-bold" style={{ color: "#007f8f" }}>
                380x
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
