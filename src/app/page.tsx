"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ComponentManager from "@/components/ComponentManager";
import AIProjectGenerator from "@/components/AIProjectGenerator";
import ProjectLibrary from "@/components/ProjectLibrary";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { useWindowResize } from "@/hooks/useWindowResize";
import type { ComponentItem } from "@/components/ComponentManager";
import type { ProjectIdea } from "@/components/AIProjectGenerator";
import type { Project } from "@/components/ProjectLibrary";

export default function Page() {
  const windowSize = useWindowResize();
  
  // Refs for sections
  const heroRef = useRef<HTMLDivElement>(null);
  const componentsRef = useRef<HTMLDivElement>(null);
  const generatorRef = useRef<HTMLDivElement>(null);
  const libraryRef = useRef<HTMLDivElement>(null);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string>();
  const [userEmail, setUserEmail] = useState<string>();
  const [userAvatarUrl, setUserAvatarUrl] = useState<string>();

  // Inventory & Library
  const [inventory, setInventory] = useState<ComponentItem[]>([]);
  const [libraryProjects, setLibraryProjects] = useState<Project[]>([]);

  // Derived inventory for AI generator
  const generatorInventory = useMemo(() => inventory.map(i => ({ id: i.id, name: i.name })), [inventory]);

  // Categories for AI generator
  const generatorCategories = useMemo(() => {
    const base = ["Robotics", "IoT", "Automation", "Wearables", "AI/ML", "Energy", "Environmental", "Home"];
    const fromInventory = Array.from(new Set(inventory.map(i => i.category))).sort();
    return [...base, ...fromInventory.filter(c => !base.includes(c))];
  }, [inventory]);

  // Header handlers
  const handleSignIn = useCallback(() => {
    setIsAuthenticated(true);
    setUserName("A. Maker");
    setUserEmail("maker@example.com");
    setUserAvatarUrl(undefined);
  }, []);
  const handleSignOut = useCallback(() => {
    setIsAuthenticated(false);
    setUserName(undefined);
    setUserEmail(undefined);
    setUserAvatarUrl(undefined);
  }, []);

  // Scroll handlers
  const handleGetStarted = useCallback(() => {
    componentsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // ComponentManager handlers
  const handleAddComponent = useCallback((item: ComponentItem) => {
    setInventory(prev => {
      const exists = prev.find(i => i.id === item.id);
      return exists
        ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [item, ...prev];
    });
  }, []);

  const handleRemoveComponent = useCallback((id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  }, []);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, quantity, available: quantity > 0 } : i));
  }, []);

  const handleBulkRemove = useCallback((ids: string[]) => {
    setInventory(prev => prev.filter(i => !ids.includes(i.id)));
  }, []);

  const handleBulkAdjust = useCallback((ids: string[], delta: number) => {
    setInventory(prev => prev.map(i => {
      if (!ids.includes(i.id)) return i;
      const q = Math.max(0, i.quantity + delta);
      return { ...i, quantity: q, available: q > 0 };
    }));
  }, []);

  // Library handlers
  const upsertLibraryProject = useCallback((p: Project) => {
    setLibraryProjects(prev => {
      const exists = prev.some(x => x.id === p.id);
      return exists ? prev.map(x => x.id === p.id ? p : x) : [p, ...prev];
    });
  }, []);

  const removeLibraryProject = useCallback((id: string) => {
    setLibraryProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const mapIdeaToProject = useCallback((idea: ProjectIdea): Project => ({
    id: idea.id,
    title: idea.title,
    category: idea.category,
    tags: idea.components.map(c => c.toLowerCase()),
    difficulty: idea.difficulty,
    status: "saved",
    dateSaved: new Date().toISOString(),
    instructions: idea.instructions.join("\n"),
    requirements: idea.components,
  }), []);

  const handleSaveProject = useCallback((idea: ProjectIdea, saved: boolean) => {
    if (saved) upsertLibraryProject(mapIdeaToProject(idea));
    else removeLibraryProject(idea.id);
  }, [mapIdeaToProject, removeLibraryProject, upsertLibraryProject]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Header
        isAuthenticated={isAuthenticated}
        userName={userName}
        userEmail={userEmail}
        userAvatarUrl={userAvatarUrl}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      <main className="w-full">
        <section ref={heroRef} className="w-full">
          <HeroSection onGetStarted={handleGetStarted} />
        </section>

        <div className="sticky top-16 z-40 w-full bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
            <div className={`flex items-center ${windowSize.isMobile ? 'justify-center' : 'justify-between'} gap-1 sm:gap-2 text-xs sm:text-sm overflow-x-auto`}>
              {[
                { label: "Intro", ref: heroRef },
                { label: "Components", ref: componentsRef },
                { label: "AI Generator", ref: generatorRef },
                { label: "Project Library", ref: libraryRef },
              ].map(({ label, ref }, index) => (
                <React.Fragment key={label}>
                  <button
                    type="button"
                    className={`rounded-md px-3 py-2 hover:bg-muted transition-colors whitespace-nowrap touch-manipulation min-h-[44px] flex items-center ${windowSize.isMobile ? 'text-xs px-2' : ''}`}
                    onClick={() => ref.current?.scrollIntoView({ behavior: "smooth" })}
                  >
                    {windowSize.isMobile ? label.split(' ')[0] : label}
                  </button>
                  {index < 3 && <Separator orientation="vertical" className={`h-5 ${windowSize.isMobile ? 'hidden' : 'hidden sm:block'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <section ref={componentsRef} className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-10 md:py-12">
          <div className={`grid grid-cols-1 gap-6 sm:gap-8 ${windowSize.isMobile ? 'lg:grid-cols-1' : 'lg:grid-cols-5'}`}>
            <div className="lg:col-span-2">
              <ComponentManager
                className="w-full"
                items={inventory}
                onAddItem={handleAddComponent}
                onRemoveItem={handleRemoveComponent}
                onUpdateQuantity={handleUpdateQuantity}
                onBulkRemove={handleBulkRemove}
                onBulkQuantityAdjust={handleBulkAdjust}
              />
            </div>
            <div ref={generatorRef} className="lg:col-span-3">
              <AIProjectGenerator
                className="w-full"
                inventory={generatorInventory}
                categories={generatorCategories}
                onSaveProject={handleSaveProject}
              />
            </div>
          </div>
        </section>

        <section ref={libraryRef} className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-8 sm:pb-12 md:pb-16">
          <ProjectLibrary projects={libraryProjects} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
