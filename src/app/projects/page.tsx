"use client";

import React from "react";
import Link from "next/link";
import ProjectLibrary from "@/components/ProjectLibrary";
import { ArrowLeft, FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <FolderKanban className="h-6 w-6 text-primary" />
                Project Library
              </h1>
              <p className="text-muted-foreground mt-1">
                Your saved STEM project ideas and inspiration 📚✨
              </p>
            </div>
            <Link href="/?scroll=generator">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Generate New Ideas
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <ProjectLibrary projects={[]} />
        
        {/* Empty state helper */}
        <div className="mt-8">
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <FolderKanban className="h-5 w-5" />
                No Projects Yet
              </CardTitle>
              <CardDescription className="text-center">
                Start by generating some project ideas based on your components
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your saved projects will appear here. Generate ideas using the AI Project Generator to get started!
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/components">
                    <Button variant="outline" size="sm">
                      Browse Components
                    </Button>
                  </Link>
                  <Link href="/?scroll=generator">
                    <Button size="sm">
                      Generate Ideas
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}