import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  brands?: string[];
  cta?: {
    text: string;
    action: () => void;
  };
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoplay?: boolean;
  autoplayInterval?: number;
}

export function Carousel({ 
  slides, 
  autoplay = true, 
  autoplayInterval = 5000 
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(autoplay);

  useEffect(() => {
    if (!isAutoplay || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [isAutoplay, slides.length, autoplayInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoplay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setIsAutoplay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoplay(false);
  };

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Carousel Container */}
      <div className="relative h-64 md:h-72 lg:h-80 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{
            backgroundImage: `url(${currentSlide.image})`,
            opacity: 0.3,
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-purple-700/40" />

        {/* Content */}
        <div className="relative h-full flex items-center px-6 md:px-12 lg:px-16">
          <div className="max-w-2xl">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
              {currentSlide.title}
            </h2>

            {/* Subtitle */}
            {currentSlide.subtitle && (
              <p className="text-lg md:text-xl text-white/90 mb-4 md:mb-6">
                {currentSlide.subtitle}
              </p>
            )}

            {/* Brands */}
            {currentSlide.brands && currentSlide.brands.length > 0 && (
              <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
                {currentSlide.brands.map((brand) => (
                  <span
                    key={brand}
                    className="px-3 md:px-4 py-1 md:py-2 bg-white/10 backdrop-blur-sm text-white text-sm md:text-base rounded-full border border-white/20"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            )}

            {/* CTA Button */}
            {currentSlide.cta && (
              <Button
                onClick={currentSlide.cta.action}
                className="bg-white text-purple-600 hover:bg-white/90 px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold"
              >
                {currentSlide.cta.text}
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 py-4 bg-background">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-accent w-8"
                : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
