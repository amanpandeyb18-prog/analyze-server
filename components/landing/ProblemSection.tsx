import { Card } from "@/components/ui/card";
import { ArrowRight, AlertCircle, Clock, DollarSign, Zap } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="py-20 px-6 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Old Way Is Broken
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Manual quotes waste time, lose customers, and kill your sales team's
            productivity
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <Clock className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Slow Process</h3>
            <p className="text-slate-600 mb-4">
              45-60 minutes per quote. 2-3 days turnaround time.
            </p>
            <p className="text-red-600 font-semibold">
              30% of customers lost due to slow response
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-8">
            <DollarSign className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Expensive</h3>
            <p className="text-slate-600 mb-4">
              €120,000/year in staff costs. €200,000+ in lost deals.
            </p>
            <p className="text-orange-600 font-semibold">
              €320,000/year total cost
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
            <Zap className="w-12 h-12 text-yellow-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Error-Prone</h3>
            <p className="text-slate-600 mb-4">
              Manual calculations, Excel chaos, email ping-pong.
            </p>
            <p className="text-yellow-600 font-semibold">
              ~15% of quotes contain errors
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
