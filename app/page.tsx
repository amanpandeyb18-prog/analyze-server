"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  Palette,
  Zap,
  Shield,
  BarChart3,
  Sparkles,
  Check,
  Layers,
  Settings,
  Rocket,
  Globe,
  Package,
  Factory,
  Sofa,
  Cpu,
  Quote,
  Star,
  TrendingUp,
  Users,
  ChevronRight,
  Clock,
  DollarSign,
  Target,
  AlertCircle,
  Download,
  Mail,
} from "lucide-react";
import Image from "next/image";
import UserWidget from "@/components/user-widget";

export default function LandingPageClient() {
  const { data: session } = useSession();

  const features = [
    {
      icon: Layers,
      title: "Visual Product Builder",
      description:
        "Create stunning configurators in 20 minutes without coding. Drag-and-drop interface makes setup effortless.",
      highlight: "No code required",
    },
    {
      icon: DollarSign,
      title: "Smart Pricing Engine",
      description:
        "Real-time price calculations with conditional rules, quantity discounts, and formula pricing. Customers see accurate pricing instantly.",
      highlight: "Instant calculations",
    },
    {
      icon: Globe,
      title: "Embed Anywhere",
      description:
        "One line of code integrates perfectly with WordPress, Shopify, or any custom website. Works flawlessly on all devices.",
      highlight: "One-line embed",
    },
    {
      icon: Zap,
      title: "Instant Quote Generation",
      description:
        "Automated PDF quotes delivered in 30 seconds. Email notifications for both customers and your sales team.",
      highlight: "30-second delivery",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Track views, interactions, conversions, and popular options. Understand what customers want and optimize accordingly.",
      highlight: "Real-time insights",
    },
    {
      icon: Settings,
      title: "Smart Compatibility Rules",
      description:
        "Set dependencies and incompatibilities to prevent invalid configurations. Customers only see valid options.",
      highlight: "Zero errors",
    },
  ];

  const painPoints = [
    {
      icon: Clock,
      problem: "45-60 minutes per manual quote",
      solution: "30 seconds automated quote",
      impact: "80% time saved",
    },
    {
      icon: Mail,
      problem: "2-3 days quote turnaround",
      solution: "Instant customer self-service",
      impact: "316% more leads",
    },
    {
      icon: AlertCircle,
      problem: "15% error rate in calculations",
      solution: "100% accurate pricing",
      impact: "Zero mistakes",
    },
    {
      icon: TrendingUp,
      problem: "30% customers lost to delays",
      solution: "28% conversion rate",
      impact: "2x conversions",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Build Your Configurator",
      description:
        "Add categories (Size, Material, Color), upload images, set pricing rules, and define compatibility logic. All in a visual interface.",
      time: "20 minutes",
      icon: Package,
    },
    {
      number: "02",
      title: "Customize & Brand",
      description:
        "Apply your brand colors, fonts, and logo. Preview in real-time. Perfect match with your website guaranteed.",
      time: "5 minutes",
      icon: Palette,
    },
    {
      number: "03",
      title: "Embed & Launch",
      description:
        "Copy one line of code, paste into your site, and go live. Update anytime without redeployment. Start generating quotes immediately.",
      time: "2 minutes",
      icon: Rocket,
    },
  ];

  const useCases = [
    {
      icon: Factory,
      title: "B2B Manufacturing",
      customer: "Sarah Chen, TechBuild Co",
      description:
        "Configure industrial machines with complex specs and custom parts. Dynamic pricing for materials, sizes, and power configurations.",
      results: ["80% time saved", "316% more leads", "2x conversions"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Sofa,
      title: "Furniture & E-commerce",
      customer: "Marcus Weber, FurnitureHub",
      description:
        "Design custom sofas with 20 fabric colors, multiple sizes, and various finishes. Visual preview updates in real-time.",
      results: [
        "45% conversion increase",
        "32% higher order value",
        "4.8/5 stars",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Cpu,
      title: "Tech & Electronics",
      customer: "Priya Patel, CustomParts Inc",
      description:
        "Build PC configurators with automatic compatibility checks. RAM matches motherboard, power supply supports GPU.",
      results: [
        "99.8% accuracy",
        "0 compatibility issues",
        "Hours saved daily",
      ],
      color: "from-orange-500 to-red-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechBuild Co",
      company: "Industrial Equipment",
      content:
        "KONFIGRA transformed our sales process. Customers can now configure complex industrial equipment themselves, reducing our quote turnaround time by 80%. We've seen a 316% increase in quote requests and our conversion rate doubled. Best €999 I've ever spent.",
      rating: 5,
      results: "380x ROI in first year",
    },
    {
      name: "Marcus Weber",
      role: "Head of E-commerce, FurnitureHub",
      company: "Custom Furniture",
      content:
        "The embed feature is seamless. Our conversion rate increased 45% since we added the configurator to our product pages. Customers love seeing their custom sofa come to life as they select options. The ROI is outstanding.",
      rating: 5,
      results: "45% conversion boost",
    },
    {
      name: "Priya Patel",
      role: "Operations Director, CustomParts Inc",
      company: "B2B Components",
      content:
        "Best investment we've made this year. The analytics help us understand what customers want, and the quote automation saves hours daily. Our engineering team can focus on actual engineering instead of creating quotes.",
      rating: 5,
      results: "€30k+ saved annually",
    },
  ];

  const stats = [
    { value: "80%", label: "Time Saved on Quotes" },
    { value: "316%", label: "More Quote Requests" },
    { value: "2x", label: "Conversion Rate Increase" },
    { value: "380x", label: "Average ROI" },
  ];

  const roiBreakdown = [
    {
      category: "Time Savings",
      before: "€30,000/year in labor",
      after: "Automated",
      savings: "€30,000",
    },
    {
      category: "Error Reduction",
      before: "15% manual mistakes",
      after: "0% errors",
      savings: "€8,000",
    },
    {
      category: "Revenue Increase",
      before: "12% conversion rate",
      after: "28% conversion rate",
      savings: "€200,000+",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" data-testid="logo-link">
                <Image
                  src={"/logo.png"}
                  alt="KONFIGRA logo"
                  height={64}
                  width={256}
                />
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
                data-testid="pricing-nav-link"
              >
                Pricing
              </Link>
              <UserWidget />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10 dark:via-background dark:to-background" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div
                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
                data-testid="hero-badge"
              >
                <Sparkles className="h-4 w-4" />
                80% Time Saved · 316% More Leads · 2x Conversions
              </div>

              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
                data-testid="hero-title"
              >
                <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                  Build Custom Products
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-blue-600 to-primary/70 bg-clip-text text-transparent">
                  Smarter, Faster
                </span>
              </h1>

              <p
                className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                data-testid="hero-description"
              >
                Stop losing customers to slow manual quotes. Let them configure
                products themselves, see prices instantly, and request quotes in
                30 seconds. Your sales team focuses on closing deals, not
                creating quotes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 shadow-lg hover:shadow-xl transition-all"
                    data-testid="hero-cta-button"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8"
                    data-testid="hero-docs-button"
                  >
                    View Documentation
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border/40">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="text-center lg:text-left"
                    data-testid={`stat-${i}`}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="relative" data-testid="hero-visual">
              <div className="glass rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl">
                <div className="bg-card/50 backdrop-blur-sm p-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      product-configurator.js
                    </span>
                  </div>
                </div>
                <div className="bg-card/30 backdrop-blur-sm p-6 text-left font-mono text-sm">
                  <pre className="text-muted-foreground">
                    <code>
                      {`// Create your configurator
const config = {
  product: "Industrial Machine",
  categories: [
    { name: "Size", options: ["Small", "Medium", "Large"] },
    { name: "Material", options: ["Steel", "Aluminum"] },
    { name: "Color", options: ["Black", "Silver", "Red"] }
  ],
  pricing: {
    basePrice: 5000,
    dynamic: true,
    rules: [
      { if: "Large + Steel", add: 2500 },
      { if: "Custom Color", add: 500 }
    ]
  }
};

// Total: €12,450 calculated instantly ✨
// Quote sent in 30 seconds 📧`}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-xl p-4 shadow-lg hidden lg:block">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">30s quotes</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-blue-500/10 backdrop-blur-md border border-blue-500/20 rounded-xl p-4 shadow-lg hidden lg:block">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">316% more leads</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section - Sarah's Story */}
      <section className="py-24 px-4 bg-muted/30" data-testid="problem-section">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <AlertCircle className="h-4 w-4" />
              The Configuration Crisis
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Manual Quote Problem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every day, businesses lose customers because manual quote
              processes are too slow. Here's what it costs:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {painPoints.map((point, i) => (
              <Card
                key={i}
                className="p-6 hover:shadow-lg transition-all duration-300"
                data-testid={`pain-point-${i}`}
              >
                <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <point.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                  {point.problem}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium text-green-600">
                    {point.solution}
                  </p>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {point.impact}
                </div>
              </Card>
            ))}
          </div>

          {/* Real Story */}
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-blue-500/5 border-primary/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <div>
                <h3 className="text-xl font-bold">Sarah Chen, CEO</h3>
                <p className="text-muted-foreground">
                  TechBuild Co - Industrial Equipment
                </p>
              </div>
            </div>
            <Quote className="h-12 w-12 text-primary/20 mb-4" />
            <p className="text-lg leading-relaxed mb-6">
              "Every machine we sell has 3 sizes, 5 materials, 8 colors, 12
              power configurations, and 20+ accessories. Customers would call,
              we'd manually calculate prices in Excel, convert to PDF, and
              email. <strong>Each quote took 45-60 minutes</strong>, and we'd
              often make calculation errors. We were{" "}
              <strong>losing 30% of customers</strong> due to slow response
              times."
            </p>
            <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-border/40">
              <div>
                <div className="text-2xl font-bold text-primary">
                  €120k/year
                </div>
                <div className="text-sm text-muted-foreground">
                  Labor costs on quotes
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">€200k+</div>
                <div className="text-sm text-muted-foreground">
                  Lost deals yearly
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">2-3 days</div>
                <div className="text-sm text-muted-foreground">
                  Quote turnaround
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4" data-testid="how-it-works-section">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              data-testid="how-it-works-title"
            >
              Get Live in 30 Minutes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your sales process. No developers
              needed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative group" data-testid={`step-${i}`}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}

                <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 hover:border-primary/40 glass">
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <div className="text-6xl font-bold text-primary/20">
                        {step.number}
                      </div>
                      <div className="text-sm font-semibold text-green-600 bg-green-500/10 px-2 py-1 rounded">
                        {step.time}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="inline-block p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-green-600">
                  Total: 27 min
                </div>
                <div className="text-left">
                  <div className="font-semibold">From zero to live</div>
                  <div className="text-sm text-muted-foreground">
                    Start generating quotes immediately
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-24 px-4 bg-muted/30"
        data-testid="features-section"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Built for Scale
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              data-testid="features-title"
            >
              Everything You Need to Win
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional features that enterprise customers demand, with
              simplicity that startups love
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="glass p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
                data-testid={`feature-${i}`}
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <span className="text-xs font-semibold text-green-600 bg-green-500/10 px-2 py-1 rounded">
                    {feature.highlight}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-4" data-testid="use-cases-section">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              data-testid="use-cases-title"
            >
              Real Businesses, Real Results
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From manufacturing to e-commerce, see how companies transformed
              their sales process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, i) => (
              <Card
                key={i}
                className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/40"
                data-testid={`use-case-${i}`}
              >
                <div className={`h-2 bg-gradient-to-r ${useCase.color}`} />
                <div className="p-8">
                  <div
                    className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${useCase.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <useCase.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-4">
                    {useCase.customer}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {useCase.description}
                  </p>
                  <div className="space-y-2">
                    {useCase.results.map((result, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                        <span>{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-24 px-4 bg-muted/30" data-testid="roi-section">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <DollarSign className="h-4 w-4" />
              Proven ROI
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Numbers Don't Lie
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real ROI from Sarah's business in the first year after
              implementing KONFIGRA
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Before */}
            <Card className="p-8 border-2 border-red-500/20 bg-red-500/5">
              <h3 className="text-2xl font-bold mb-6 text-red-600 dark:text-red-400">
                Before KONFIGRA
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <span className="text-muted-foreground">
                    Quote requests/month
                  </span>
                  <span className="font-bold">45</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <span className="text-muted-foreground">Response time</span>
                  <span className="font-bold">2-3 days</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <span className="text-muted-foreground">Conversion rate</span>
                  <span className="font-bold">12%</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <span className="text-muted-foreground">Labor time</span>
                  <span className="font-bold">60 hours/month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Annual cost</span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    €320,000+
                  </span>
                </div>
              </div>
            </Card>

            {/* After */}
            <Card className="p-8 border-2 border-green-500/20 bg-green-500/5">
              <h3 className="text-2xl font-bold mb-6 text-green-600 dark:text-green-400">
                After KONFIGRA
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <span className="text-muted-foreground">
                    Quote requests/month
                  </span>
                  <span className="font-bold">
                    187{" "}
                    <span className="text-green-600 text-sm">(+316% ↗)</span>
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <span className="text-muted-foreground">Response time</span>
                  <span className="font-bold">
                    30 seconds{" "}
                    <span className="text-green-600 text-sm">(instant ⚡)</span>
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <span className="text-muted-foreground">Conversion rate</span>
                  <span className="font-bold">
                    28%{" "}
                    <span className="text-green-600 text-sm">(+133% ↗)</span>
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <span className="text-muted-foreground">Labor time</span>
                  <span className="font-bold">
                    5 hours/month{" "}
                    <span className="text-green-600 text-sm">(-92% ↘)</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Additional revenue
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    €350,000+
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* ROI Calculation */}
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20">
            <h3 className="text-2xl font-bold mb-6 text-center">
              ROI Breakdown
            </h3>
            <div className="space-y-4 mb-8">
              {roiBreakdown.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-background/50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold">{item.category}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.before} → {item.after}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {item.savings}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-primary/20 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-lg font-semibold">KONFIGRA Cost</div>
                  <div className="text-sm text-muted-foreground">
                    Yearly plan
                  </div>
                </div>
                <div className="text-2xl font-bold">€999/year</div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-lg font-semibold">Total Benefit</div>
                  <div className="text-sm text-muted-foreground">
                    Savings + Revenue
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  €380,000+
                </div>
              </div>
              <div className="flex items-center justify-between bg-primary/20 rounded-lg p-6">
                <div>
                  <div className="text-2xl font-bold">Return on Investment</div>
                  <div className="text-sm text-muted-foreground">
                    Break-even in 1 day
                  </div>
                </div>
                <div className="text-5xl font-bold text-primary">380x</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Live Demo Preview Section */}
      <section
        className="py-24 px-4 relative overflow-hidden"
        data-testid="demo-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-500/5 dark:from-primary/10 dark:via-background dark:to-blue-500/10" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              data-testid="demo-title"
            >
              See KONFIGRA in Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch how customers configure products, see prices update
              instantly, and request quotes in seconds
            </p>
          </div>

          <div className="relative">
            <div className="glass rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl">
              {/* Browser mockup header */}
              <div className="bg-card/80 backdrop-blur-sm p-4 border-b border-border/50 flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 bg-muted/50 rounded px-4 py-1 text-xs text-muted-foreground">
                  https://your-website.com/configurator
                </div>
              </div>

              {/* Demo content */}
              <div className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left: Product Preview */}
                  <div className="bg-muted/30 rounded-xl p-8 flex items-center justify-center border border-border/40">
                    <div className="text-center">
                      <div className="w-48 h-48 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                        <Package className="h-24 w-24 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Product Preview
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updates in real-time ⚡
                      </p>
                    </div>
                  </div>

                  {/* Right: Configuration Options */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Select Size
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Small", "Medium", "Large"].map((size) => (
                          <div
                            key={size}
                            className="border-2 border-primary bg-primary/10 rounded-lg p-3 text-center text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                          >
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Choose Material
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Steel", "Aluminum"].map((material) => (
                          <div
                            key={material}
                            className="border border-border rounded-lg p-3 text-center text-sm font-medium hover:border-primary transition-colors cursor-pointer"
                          >
                            {material}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/40">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-muted-foreground">
                          Total Price:
                        </span>
                        <span className="text-3xl font-bold text-primary">
                          €12,450
                        </span>
                      </div>
                      <Button className="w-full" size="lg">
                        Request Quote
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        PDF delivered in 30 seconds 📧
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating indicators */}
            <div className="absolute -top-6 -left-6 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-xl p-4 shadow-lg hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Live Pricing
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                data-testid="demo-cta-button"
              >
                Try the Full Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-24 px-4 bg-muted/30"
        data-testid="testimonials-section"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              Trusted by 500+ Businesses
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              data-testid="testimonials-title"
            >
              Don't Just Take Our Word
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real customers, real results, real ROI. Here's what they achieved
              in their first year
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card
                key={i}
                className="p-6 hover:shadow-xl transition-all duration-300 glass"
                data-testid={`testimonial-${i}`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-5 w-5 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>

                <Quote className="h-8 w-8 text-primary/20 mb-4" />

                <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-primary">
                      {testimonial.company}
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {testimonial.results}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-16 border-t border-border/40">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">500+ businesses</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Enterprise-grade security
                </p>
              </div>
              <div className="text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  99.9% uptime SLA
                </p>
              </div>
              <div className="text-center">
                <Globe className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Global CDN delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        className="py-24 px-4 relative overflow-hidden"
        data-testid="final-cta-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-blue-500/10 dark:from-primary/20 dark:via-background dark:to-blue-500/20" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="glass rounded-3xl p-12 border-2 border-primary/20 shadow-2xl">
            <Rocket className="h-16 w-16 mx-auto mb-6 text-primary" />

            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
              data-testid="final-cta-title"
            >
              Ready to 10x Your Sales Process?
            </h2>

            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Join 500+ businesses using KONFIGRA to create stunning product
              configurators and close more deals.
            </p>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8 max-w-xl mx-auto">
              <div className="text-sm text-muted-foreground mb-2">
                Average results in first year:
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-primary">380x</div>
                  <div className="text-xs text-muted-foreground">ROI</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">316%</div>
                  <div className="text-xs text-muted-foreground">
                    More Leads
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">80%</div>
                  <div className="text-xs text-muted-foreground">
                    Time Saved
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/register">
                <Button
                  size="lg"
                  className="text-lg px-8 shadow-lg hover:shadow-xl transition-all"
                  data-testid="final-cta-button"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8"
                  data-testid="pricing-cta-button"
                >
                  View Pricing
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Free 14-day trial
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Setup in 30 minutes
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="logo-text text-lg mb-4">KONFIGRA</h3>
              <p className="text-sm text-muted-foreground">
                The modern product configurator platform for ambitious
                businesses. 380x ROI on average.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/docs/api"
                    className="hover:text-foreground transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="/docs/embedding"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/docs/customization"
                    className="hover:text-foreground transition-colors"
                  >
                    Customization Guide
                  </a>
                </li>
                <li>
                  <a
                    href="/docs/embedding"
                    className="hover:text-foreground transition-colors"
                  >
                    Embedding Guide
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 KONFIGRA. All rights reserved.
            </p>
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  );
}
