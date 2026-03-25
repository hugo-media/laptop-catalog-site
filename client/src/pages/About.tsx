import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function About() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Button>
          <h1 className="text-2xl font-bold">About Us</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Hero Section */}
          <section className="space-y-4">
            <h2 className="text-4xl font-bold">Premium Laptop Solutions</h2>
            <p className="text-lg text-muted-foreground">
              We specialize in curating and delivering the finest selection of high-performance laptops for professionals, creators, and gamers worldwide.
            </p>
          </section>

          {/* Our Mission */}
          <section className="space-y-4 pt-8 border-t border-border">
            <h3 className="text-2xl font-semibold">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our mission is to provide customers with access to the latest and most powerful laptop technology. We carefully select each product in our catalog to ensure it meets the highest standards of performance, reliability, and value. Whether you're looking for a workstation for professional tasks, a gaming powerhouse, or a portable ultrabook, we have the perfect solution for you.
            </p>
          </section>

          {/* What We Do */}
          <section className="space-y-4 pt-8 border-t border-border">
            <h3 className="text-2xl font-semibold">What We Do</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">Expert Curation:</strong> We handpick every laptop in our inventory, focusing on the latest 2025 models from leading manufacturers like Dell, HP, Lenovo, and Alienware.
              </p>
              <p>
                <strong className="text-foreground">Professional Workstations:</strong> We offer high-end mobile workstations designed for engineers, designers, and content creators who demand maximum performance.
              </p>
              <p>
                <strong className="text-foreground">Gaming Performance:</strong> Our gaming laptops feature the latest NVIDIA graphics cards and powerful processors for an immersive gaming experience.
              </p>
              <p>
                <strong className="text-foreground">Business Solutions:</strong> We provide reliable, secure business laptops with professional features and extended warranty support.
              </p>
              <p>
                <strong className="text-foreground">Official Warranties:</strong> All products come with official manufacturer warranties, ensuring peace of mind and long-term support.
              </p>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="space-y-4 pt-8 border-t border-border">
            <h3 className="text-2xl font-semibold">Why Choose Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Latest 2025 technology and models</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Competitive pricing with transparent specifications</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Official manufacturer warranties and support</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Expert product knowledge and recommendations</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Reliable delivery and customer service</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Comprehensive product specifications and comparisons</span>
              </li>
            </ul>
          </section>

          {/* Our Products */}
          <section className="space-y-4 pt-8 border-t border-border">
            <h3 className="text-2xl font-semibold">Our Product Range</h3>
            <p className="text-muted-foreground">
              We maintain an extensive catalog of premium laptops including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary/20 rounded-lg">
                <p className="font-semibold text-foreground mb-2">Gaming Laptops</p>
                <p className="text-sm text-muted-foreground">High-performance gaming systems with RTX graphics cards</p>
              </div>
              <div className="p-4 bg-secondary/20 rounded-lg">
                <p className="font-semibold text-foreground mb-2">Workstations</p>
                <p className="text-sm text-muted-foreground">Professional mobile workstations for 3D, CAD, and rendering</p>
              </div>
              <div className="p-4 bg-secondary/20 rounded-lg">
                <p className="font-semibold text-foreground mb-2">Business Laptops</p>
                <p className="text-sm text-muted-foreground">Reliable ultrabooks and business-class systems</p>
              </div>
              <div className="p-4 bg-secondary/20 rounded-lg">
                <p className="font-semibold text-foreground mb-2">Premium Ultrabooks</p>
                <p className="text-sm text-muted-foreground">Lightweight, portable systems for professionals on the go</p>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="space-y-4 pt-8 border-t border-border">
            <h3 className="text-2xl font-semibold">Ready to Find Your Perfect Laptop?</h3>
            <p className="text-muted-foreground">
              Browse our complete catalog to explore all available models, specifications, and pricing. Our team is here to help you find the right laptop for your needs.
            </p>
            <Button onClick={() => navigate("/")} size="lg" className="mt-4">
              Browse Our Catalog
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
