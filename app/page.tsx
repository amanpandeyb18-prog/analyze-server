"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  Code2,
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
        "Drag-and-drop interface to create stunning product configurators without coding.",
    },
    {
      icon: Palette,
      title: "Dynamic Pricing Engine",
      description:
        "Real-time price calculations based on customer selections and rules.",
    },
    {
      icon: Globe,
      title: "Embed Anywhere",
      description:
        "Seamlessly embed your configurators into any website with a single line of code.",
    },
    {
      icon: Settings,
      title: "Flexible Customization",
      description:
        "Unlimited options, categories, and compatibility rules for complex products.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Track customer behavior, popular configurations, and conversion metrics.",
    },
    {
      icon: Zap,
      title: "Instant Quote Generation",
      description:
        "Automated quote PDFs and email delivery to streamline your sales process.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Configurator",
      description:
        "Set up product categories, options, pricing rules, and compatibility logic in minutes.",
      icon: Package,
    },
    {
      number: "02",
      title: "Customize & Brand",
      description:
        "Apply your brand colors, fonts, and styling to match your website perfectly.",
      icon: Palette,
    },
    {
      number: "03",
      title: "Deploy & Scale",
      description:
        "Embed on your site or share as standalone. Update anytime without redeployment.",
      icon: Rocket,
    },
  ];

  const useCases = [
    {
      icon: Factory,
      title: "Manufacturing",
      description:
        "Configure industrial machines, equipment specs, and custom parts with complex pricing rules.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Sofa,
      title: "Furniture & Decor",
      description:
        "Let customers design custom furniture with materials, dimensions, and finishes in real-time.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Cpu,
      title: "Tech Products",
      description:
        "Build PC configurators, software packages, or hardware bundles with dynamic pricing.",
      color: "from-orange-500 to-red-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechBuild Co",
      content:
        "KONFIGRA transformed our sales process. Customers can now configure complex industrial equipment themselves, reducing our quote turnaround time by 80%.",
      rating: 5,
    },
    {
      name: "Marcus Weber",
      role: "Head of E-commerce, FurnitureHub",
      content:
        "The embed feature is seamless. Our conversion rate increased 45% since we added the configurator to our product pages. Outstanding ROI.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Operations Director, CustomParts Inc",
      content:
        "Best investment we've made this year. The analytics help us understand what customers want, and the quote automation saves hours daily.",
      rating: 5,
    },
  ];

  const stats = [
    { value: "10,000+", label: "Configurations Created" },
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "45%", label: "Avg. Conversion Increase" },
    { value: "80%", label: "Time Saved on Quotes" },
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
                The Future of Product Customization
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
                Empower your customers to design and personalize products in
                real time. Our intelligent configurator platform makes
                customization seamless, visual, and ready to scale.
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
  },
  theme: {
    primary: "#0ea5e9",
    borderRadius: "0.75rem"
  }
};

// Total: €7,500 calculated instantly ✨`}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-primary/10 backdrop-blur-md border border-primary/20 rounded-xl p-4 shadow-lg hidden lg:block">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Real-time pricing</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-blue-500/10 backdrop-blur-md border border-blue-500/20 rounded-xl p-4 shadow-lg hidden lg:block">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Instant quotes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        className="py-24 px-4 bg-muted/30"
        data-testid="how-it-works-section"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              data-testid="how-it-works-title"
            >
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get your custom product configurator up and running in three
              simple steps
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
                    <div className="text-6xl font-bold text-primary/20 mb-2">
                      {step.number}
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4" data-testid="features-section">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Powerful Features
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              data-testid="features-title"
            >
              Everything You Need to Scale
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for businesses that need flexibility, power, and simplicity
              in their product customization workflow
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
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section
        className="py-24 px-4 bg-muted/30"
        data-testid="use-cases-section"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              data-testid="use-cases-title"
            >
              Built for Every Industry
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From manufacturing to e-commerce, KONFIGRA adapts to your unique
              business needs
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
                  <h3 className="text-2xl font-semibold mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {useCase.description}
                  </p>
                  <div className="mt-6 flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                    Learn more <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
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
              Experience the power of visual product configuration with our
              interactive demo
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
                        Updates in real-time
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
                          €7,500
                        </span>
                      </div>
                      <Button className="w-full" size="lg">
                        Request Quote
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
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
                  Live Preview
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
              Loved by Teams Worldwide
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              data-testid="testimonials-title"
            >
              Don't Just Take Our Word
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how businesses are transforming their sales process with
              KONFIGRA
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

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </div>
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
                <p className="text-xs text-muted-foreground">
                  Trusted by 500+ businesses
                </p>
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
              Ready to Transform Your Sales?
            </h2>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses using KONFIGRA to create stunning
              product configurators. Start your free trial today—no credit card
              required.
            </p>

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

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
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
                businesses
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
