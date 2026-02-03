"use client";

import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { ROISection } from "@/components/landing/ROISection";
import { DemoSection } from "@/components/landing/DemoSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPageClient() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-50 text-slate-900"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <LandingNav />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <UseCasesSection />
      <ROISection />
      {/* <DemoSection /> */}
      {/* <TestimonialsSection /> */}
      <CTASection />
      <LandingFooter />
    </div>
  );
}
