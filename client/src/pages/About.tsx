import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export default function About() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur-md z-50">
        <div className="container py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Hero Section */}
          <section className="space-y-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">About Hugo Media</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your trusted partner for premium laptop solutions and professional computing equipment.
              </p>
            </div>
          </section>

          {/* Company Story */}
          <section className="space-y-6 py-8 border-y border-border/40">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Hugo Media was founded with a simple mission: to provide access to premium, high-performance laptops and workstations at competitive prices. We understand that quality computing equipment is essential for professionals, creators, and businesses—but it shouldn't break the bank.
                </p>
                <p>
                  With years of experience in the technology sector, our team has developed deep expertise in sourcing, testing, and delivering the finest laptops and workstations. We partner with leading manufacturers and certified suppliers to ensure every device meets our rigorous quality standards.
                </p>
                <p>
                  Today, Hugo Media serves thousands of satisfied customers across Poland, from individual professionals to large enterprises. We're proud of our reputation for reliability, transparency, and exceptional customer service.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Why Choose Hugo Media?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3 p-6 rounded-lg bg-secondary/20 border border-border/40">
                <h3 className="font-bold text-lg text-foreground">Curated Selection</h3>
                <p className="text-muted-foreground">
                  Every laptop in our catalog is carefully selected and tested to ensure it meets our high standards for performance, reliability, and value.
                </p>
              </div>
              <div className="space-y-3 p-6 rounded-lg bg-secondary/20 border border-border/40">
                <h3 className="font-bold text-lg text-foreground">Official Warranties</h3>
                <p className="text-muted-foreground">
                  All our products come with official manufacturer warranties and comprehensive coverage, giving you peace of mind with every purchase.
                </p>
              </div>
              <div className="space-y-3 p-6 rounded-lg bg-secondary/20 border border-border/40">
                <h3 className="font-bold text-lg text-foreground">Expert Support</h3>
                <p className="text-muted-foreground">
                  Our team of technology experts is available to answer questions, provide recommendations, and offer technical support throughout your ownership.
                </p>
              </div>
              <div className="space-y-3 p-6 rounded-lg bg-secondary/20 border border-border/40">
                <h3 className="font-bold text-lg text-foreground">Competitive Pricing</h3>
                <p className="text-muted-foreground">
                  We offer the best value in the market without compromising on quality, backed by our price-match guarantee and transparent pricing.
                </p>
              </div>
              <div className="space-y-3 p-6 rounded-lg bg-secondary/20 border border-border/40">
                <h3 className="font-bold text-lg text-foreground">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Free shipping on orders over 400 PLN with fast, reliable delivery across Poland. Track your order in real-time.
                </p>
              </div>
              <div className="space-y-3 p-6 rounded-lg bg-secondary/20 border border-border/40">
                <h3 className="font-bold text-lg text-foreground">Easy Returns</h3>
                <p className="text-muted-foreground">
                  14-day return policy with no questions asked. If you're not satisfied, we'll make it right with hassle-free returns and exchanges.
                </p>
              </div>
            </div>
          </section>

          {/* Our Commitment */}
          <section className="space-y-6 py-8 border-y border-border/40">
            <h2 className="text-3xl font-bold text-foreground">Our Commitment</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We're committed to sustainability and responsible business practices. By offering premium refurbished and certified pre-owned laptops alongside new models, we help reduce electronic waste while providing exceptional value to our customers.
              </p>
              <p>
                Every device is thoroughly tested, cleaned, and prepared to the highest standards. We believe in transparency—you'll always know exactly what you're getting, with detailed specifications and honest condition ratings.
              </p>
              <p>
                Hugo Media isn't just about selling laptops. We're about building long-term relationships with our customers and becoming your trusted technology partner.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Get in Touch</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-4 p-6 rounded-lg bg-secondary/20 border border-border/40">
                <Mail className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground">info@hugomedia.pl</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-lg bg-secondary/20 border border-border/40">
                <Phone className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <p className="text-muted-foreground">+48 XXX XXX XXX</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-lg bg-secondary/20 border border-border/40">
                <MapPin className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Support</h3>
                  <p className="text-muted-foreground">24/7 Available</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-12">
            <Button 
              onClick={() => navigate("/")} 
              size="lg"
              className="bg-accent hover:bg-accent/90 gap-2"
            >
              Browse Our Catalog
            </Button>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/20 mt-20">
        <div className="container py-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; 2025 Hugo Media. All rights reserved. Premium gadget showroom.
          </p>
        </div>
      </footer>
    </div>
  );
}
