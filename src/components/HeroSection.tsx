"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { BrainCog, Goal, FolderKanban, Rocket, CircuitBoard, WandSparkles } from "lucide-react";
import { useWindowResize } from "@/hooks/useWindowResize";
import AnimatedBackground from "./AnimatedBackground";
import AnimatedTitle from "./AnimatedTitle";
import FloatingElements from "./FloatingElements";

export interface HeroSectionProps {
  className?: string;
  style?: React.CSSProperties;
  onGetStarted?: () => void;
}

const benefits = [
  {
    icon: BrainCog,
    title: "AI project suggestions",
    desc: "Turn your components into smart, build-ready ideas.",
  },
  {
    icon: Goal,
    title: "Tailored to skill level",
    desc: "From beginner to advanced, projects match your pace.",
  },
  {
    icon: FolderKanban,
    title: "Organize and track",
    desc: "Save, categorize, and refine your project ideas.",
  },
];

export default function HeroSection({ className, style, onGetStarted }: HeroSectionProps) {
  const windowSize = useWindowResize();

  React.useEffect(() => {
    // Log window resize for debugging
    console.log('Window resized:', {
      width: windowSize.width,
      height: windowSize.height,
      isMobile: windowSize.isMobile,
      isTablet: windowSize.isTablet,
      isDesktop: windowSize.isDesktop
    });
  }, [windowSize]);
  return (
    <section
      className={`relative w-full bg-background overflow-hidden ${className ?? ""}`}
      style={style}
      aria-label="Intro to Atal Idea Generator"
    >
      {/* Animated Background */}
      <AnimatedBackground />
      
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 relative z-10">
        {/* Floating Tech Elements */}
        <FloatingElements className="absolute inset-0" />
        
        <div className={`grid gap-8 md:gap-12 lg:gap-16 ${windowSize.isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} items-center relative z-20`}>
          {/* Left: Copy */}
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground ring-1 ring-inset ring-border">
              <WandSparkles className="size-3.5" aria-hidden="true" />
              <span className="truncate">AI-powered STEM projects</span>
            </div>

            <AnimatedTitle className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-foreground break-words">
              Turn electronic components into buildable project ideas
            </AnimatedTitle>

            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              Atal Idea Generator helps you explore, tailor, and organize STEM projects. Add your
              parts—resistors, sensors, microcontrollers—and instantly get ideas that fit your goals
              and experience.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3">
              <Button
                size="lg"
                onClick={onGetStarted}
                aria-label="Get started with Atal Idea Generator"
                className={`${windowSize.isMobile ? 'w-full text-lg py-4' : 'w-full sm:w-auto'} h-14 sm:h-auto text-base rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors touch-manipulation`}
              >
                <Rocket className="mr-2 size-5" aria-hidden="true" />
                Get started
              </Button>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <CircuitBoard className="size-4" aria-hidden="true" />
                <span className="min-w-0 truncate">No setup needed — just list your components</span>
              </div>
            </div>

            {/* Benefits */}
            <ul className="mt-8 sm:mt-10 grid grid-cols-1 gap-4 sm:gap-5">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <li
                    key={i}
                    className="group rounded-lg bg-card border border-border p-4 sm:p-5 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 rounded-md bg-brand-soft text-brand p-2 ring-1 ring-inset ring-border">
                        <Icon className="size-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-6">
                          {b.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {b.desc}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="relative rounded-xl bg-card border border-border p-4 sm:p-6 overflow-hidden">
              {/* Decorative gradient */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-40"
                style={{
                  background:
                    "radial-gradient(closest-side, var(--color-brand) 0%, transparent 70%)",
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Rocket className="size-4 text-brand" aria-hidden="true" />
                  <span>From parts to projects</span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {/* Image 1 */}
                  <div className="col-span-2 row-span-2 relative rounded-lg overflow-hidden ring-1 ring-inset ring-border">
                    <img
                      src="https://images.unsplash.com/photo-1555617981-dac3880b0213?q=80&w=1200&auto=format&fit=crop"
                      alt="Electronics prototyping board with components"
                      className="block w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Image 2 */}
                  <div className="relative rounded-lg overflow-hidden ring-1 ring-inset ring-border">
                    <img
                      src="https://images.unsplash.com/photo-1557264337-e8a93017fe92?q=80&w=1200&auto=format&fit=crop"
                      alt="Robotics and maker tools on a workbench"
                      className="block w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Image 3 */}
                  <div className="relative rounded-lg overflow-hidden ring-1 ring-inset ring-border">
                    <img
                      src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop"
                      alt="Microcontroller and wiring close-up"
                      className="block w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Caption card */}
                <div className="mt-4 sm:mt-5 rounded-lg bg-secondary text-secondary-foreground border border-border p-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 rounded-md bg-brand-soft text-brand p-2 ring-1 ring-inset ring-border">
                      <WandSparkles className="size-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-6 text-foreground">
                        Smart matches from your components
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Example: HC-SR04 + Arduino + Buzzer → Parking assist, water level meter,
                        or distance alarm.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle shadow lift on hover for the visual block */}
            <div className="pointer-events-none absolute inset-0 rounded-xl transition duration-300 [box-shadow:0_0_0_0_rgba(0,0,0,0)] hover:[box-shadow:0_24px_48px_-24px_rgba(0,0,0,0.25)]" />
          </div>
        </div>
      </div>
    </section>
  );
}