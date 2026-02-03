"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  ArrowLeft,
  Crown,
  ChevronDown,
  ChevronUp,
  Database,
  Sparkles,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import UserWidget from "@/components/user-widget";
import Image from "next/image";

export default function PricingPage() {
  const plans = [
    {
      duration: "yearly",
      name: "Yearly",
      price: "€999",
      monthlyEquivalent: "€83",
      period: "per year",
      description: "Best value for growing businesses",
      savings: "Save €189/year",
      popular: true,
      cta: "Best value for growing teams",
      coreFeatures: [
        "Unlimited configurators",
        "Unlimited quotes",
        "10 options included",
        "Priority email support",
        "Advanced analytics",
        "Custom branding",
      ],
      premiumFeatures: [
        "White-label option",
        "Dedicated account manager",
        "Custom integrations",
        "Early access to features",
        "99.9% uptime SLA",
        "API access",
      ],
    },
    {
      duration: "monthly",
      name: "Monthly",
      price: "€99",
      period: "per month",
      description: "Perfect for trying out Konfigra",
      popular: false,
      cta: "Perfect for quick trials and MVPs",
      coreFeatures: [
        "Unlimited configurators",
        "Unlimited quotes",
        "10 options included",
        "Email support",
        "Analytics dashboard",
        "Custom branding",
      ],
      premiumFeatures: ["API access", "Embed anywhere", "SSL security"],
    },
  ];

  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const handleSubscribe = async (duration: "monthly" | "yearly") => {
    if (!session) {
      signIn(undefined, { callbackUrl: `/dashboard/billing?plan=${duration}` });
      return;
    }

    // prevent duplicate checkout for active subscribers
    const currentStatus = session?.user?.subscriptionStatus;
    const currentDuration = session?.user?.subscriptionDuration;

    if (
      currentStatus === "ACTIVE" &&
      currentDuration?.toLowerCase() === duration
    ) {
      toast.info(`You already have an active ${duration} plan.`);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/billing/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration: duration === "monthly" ? "MONTHLY" : "YEARLY",
          successUrl: `${window.location.origin}/dashboard/billing?success=true`,
          cancelUrl: `${window.location.origin}/dashboard/billing?canceled=true`,
        }),
      });

      if (!res.ok) throw new Error("Failed to create checkout session");
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (err: any) {
      toast.error(err?.message || "Failed to start checkout");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-50 text-slate-900"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image src={"/logo.png"} alt="logo" height={64} width={256} />
            </Link>
          </div>
          {/* Add UserWidget here when integrating auth */}
        </div>
      </nav>

      {/* Header */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-6xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-full mb-8 backdrop-blur-sm"
            style={{
              background: "rgba(0, 127, 143, 0.1)",
              borderColor: "rgba(0, 127, 143, 0.3)",
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: "#007f8f" }} />
            <span className="text-sm font-medium" style={{ color: "#007f8f" }}>
              Simple, transparent pricing
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Start free. Scale when you're ready. ROI guaranteed.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {plans.map((plan) => {
            const userHasThisPlan = false; // Replace with actual logic when integrating auth

            return (
              <div
                key={plan.duration}
                className={`relative rounded-3xl transition-all ${
                  plan.popular
                    ? "border-2 shadow-2xl scale-[1.02]"
                    : "border bg-white/90 shadow-sm hover:shadow-xl"
                }`}
                style={{
                  borderColor: plan.popular ? "#007f8f" : "rgb(226, 232, 240)",
                  background: plan.popular
                    ? "linear-gradient(to bottom right, rgba(0, 127, 143, 0.1), rgba(0, 163, 184, 0.1))"
                    : undefined,
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2 px-5 rounded-full flex items-center gap-2 shadow-md">
                    <Crown className="h-4 w-4" /> Best Value
                  </div>
                )}

                <div className="text-center pt-10 px-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </h2>
                  <p className="text-base text-slate-600 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    <span
                      className="text-5xl font-extrabold"
                      style={{ color: plan.popular ? "#007f8f" : "#0f172a" }}
                    >
                      {plan.price}
                    </span>
                    <span className="ml-2 text-slate-500">{plan.period}</span>
                    {plan.monthlyEquivalent && (
                      <p
                        className="mt-1 text-sm font-medium"
                        style={{ color: "#007f8f" }}
                      >
                        Only {plan.monthlyEquivalent}/month — billed annually
                      </p>
                    )}
                  </div>
                  {plan.savings && (
                    <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      <Check className="h-4 w-4" />
                      {plan.savings}
                    </div>
                  )}
                </div>

                <div className="px-6 pb-8 pt-6 space-y-6">
                  <div className="border-t border-slate-200"></div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-600 mb-3">
                      Core Features
                    </h4>
                    <ul className="space-y-2">
                      {plan.coreFeatures.map((f, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-slate-700"
                        >
                          <Check
                            className="h-4 w-4 mt-0.5 flex-shrink-0"
                            style={{ color: "#007f8f" }}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.premiumFeatures.length > 0 && (
                    <div>
                      <button
                        onClick={() =>
                          setExpandedPlan(
                            expandedPlan === plan.duration
                              ? null
                              : plan.duration,
                          )
                        }
                        className="flex items-center gap-2 text-xs font-semibold uppercase transition-colors"
                        style={{ color: "#007f8f" }}
                      >
                        Premium Extras
                        {expandedPlan === plan.duration ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      {expandedPlan === plan.duration && (
                        <ul className="space-y-2 mt-2">
                          {plan.premiumFeatures.map((f, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-sm text-slate-700"
                            >
                              <Check
                                className="h-4 w-4 mt-0.5 flex-shrink-0"
                                style={{ color: "#007f8f" }}
                              />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <div className="pt-6">
                    <button
                      onClick={() =>
                        handleSubscribe(plan.duration as "monthly" | "yearly")
                      }
                      disabled={loading || userHasThisPlan}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        userHasThisPlan
                          ? "opacity-70 cursor-not-allowed bg-slate-100 text-slate-500"
                          : plan.popular
                            ? "text-white shadow-lg hover:opacity-90"
                            : "border-2 border-slate-300 hover:border-slate-400 bg-white"
                      }`}
                      style={
                        !userHasThisPlan && plan.popular
                          ? { background: "#007f8f" }
                          : undefined
                      }
                    >
                      {userHasThisPlan
                        ? "Already Subscribed"
                        : loading
                          ? "Processing..."
                          : "Get Started"}
                    </button>
                    <p className="text-xs text-center mt-3 text-slate-500 italic">
                      {plan.cta}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Extras */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <div
          className="rounded-2xl text-white border-0 shadow-xl p-8"
          style={{
            background: "linear-gradient(to bottom right, #007f8f, #00a3b8)",
          }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="p-4 bg-white/15 rounded-2xl">
              <Database className="h-12 w-12 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-2">Need More Options?</h3>
              <p className="text-cyan-100">
                All plans include{" "}
                <span className="font-semibold text-white">10 options</span> for
                your configurators. Add extra capacity anytime for only €10 per
                10 options — directly from your billing dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white"
                style={{ background: "#007f8f" }}
              >
                K
              </div>
              <span className="text-xl font-bold">KONFIGRA</span>
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
              © 2025 KONFIGRA. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
