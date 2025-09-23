"use client";

import * as React from "react";
import Link from "next/link";
import { Instagram, Linkedin, Contact, Group, QrCode } from "lucide-react";

export interface FooterProps {
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
}

function BrandMark() {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border bg-accent/60 text-accent-foreground shadow-sm">
      <span className="text-sm font-bold tracking-tight">AI</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-primary/10"
      />
    </div>
  );
}

const navSections: {
  title: string;
  items: { label: string; href?: string }[];
}[] = [
  {
    title: "Platform",
    items: [
      { label: "Overview" },
      { label: "Component Library" },
      { label: "AI Generator" },
      { label: "Project Manager" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Docs" },
      { label: "Guides" },
      { label: "Templates" },
      { label: "Changelog" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help Center" },
      { label: "Status" },
      { label: "Security" },
      { label: "Accessibility" },
    ],
  },
  {
    title: "Community",
    items: [
      { label: "Events" },
      { label: "Showcase" },
      { label: "Contributors" },
      { label: "Open Source" },
    ],
  },
];

export default function Footer({ className, style, compact = false }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={[
        "w-full bg-secondary text-foreground border-t",
        compact ? "py-8" : "py-12",
        className || "",
      ].join(" ")}
      style={style}
      aria-labelledby="footer-heading"
    >
      <div className="mx-auto w-full max-w-full px-6 sm:px-8">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>

        {/* Top: Brand and Inspiration */}
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <BrandMark />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href="/"
                    className="text-base sm:text-lg font-semibold tracking-tight hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 rounded-md"
                  >
                    Atal Idea Generator
                  </Link>
                  <span className="hidden h-1.5 w-1.5 rounded-full bg-primary/70 sm:inline-block" aria-hidden="true" />
                  <span className="text-xs sm:text-sm text-muted-foreground truncate">
                    Build. Learn. Iterate.
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground max-w-prose">
                  Empowering makers to turn curiosity into tangible STEM projects with AI-assisted creativity.
                </p>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Visit our Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-card text-foreground hover:text-primary hover:shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Visit our LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-card text-foreground hover:text-primary hover:shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://atal-innovation-mission-niti.gov.in/"
                target="_blank"
                rel="noreferrer"
                aria-label="Learn about Atal Innovation Mission"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-card text-foreground hover:text-primary hover:shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
              >
                <QrCode className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-border/80" />

          {/* Links Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6">
            {/* Contact + Message */}
            <div className="sm:col-span-2 lg:col-span-2">
              <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Contact
              </h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Contact className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                  <div className="min-w-0">
                    <a
                      href="mailto:support@atalideas.ai"
                      className="truncate hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 rounded-sm"
                    >
                      support@atalideas.ai
                    </a>
                    <p className="text-muted-foreground">We aim to respond within 1–2 business days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Group className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="break-words">
                      Makers thrive together. Share, remix, and celebrate projects that spark real-world impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            {navSections.map((section) => (
              <nav key={section.title} aria-label={section.title} className="lg:col-span-1">
                <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {section.items.map((item) => {
                    const isLink = Boolean(item.href);
                    if (isLink) {
                      return (
                        <li key={item.label}>
                          <Link
                            href={item.href as string}
                            className="text-sm text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 rounded-sm"
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    }
                    return (
                      <li key={item.label}>
                        <span
                          aria-disabled="true"
                          className="text-sm text-foreground/90 hover:text-primary/80 transition-colors cursor-not-allowed"
                        >
                          {item.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="h-px w-full bg-border/60" />

          <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-xs text-muted-foreground">
              © {year} Atal Idea Generator. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary/80" aria-hidden="true" />
                Reliable, accessible, and fast by design.
              </span>
              <span className="hidden sm:inline-block text-border">•</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="sr-only">Brand accent</span>
                <span className="h-3 w-6 rounded-full bg-accent" aria-hidden="true" />
                <span className="h-3 w-3 rounded-full bg-primary/70" aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}