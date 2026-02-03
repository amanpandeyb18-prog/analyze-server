import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package } from "lucide-react";

export function DemoSection() {
  return (
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
            Watch how customers configure products, see prices update instantly,
            and request quotes in seconds
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
  );
}
