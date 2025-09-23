"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { apiService } from "@/services/apiService";
import PredefinedIdeas, { PREDEFINED_IDEAS } from "./PredefinedIdeas";
import ApiErrorNotification from "./ApiErrorNotification";
import {
  BrainCog,
  IterationCw,
  Microchip,
  SquareChartGantt,
  InspectionPanel,
  Workflow,
  FolderKanban,
  BotMessageSquare,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Difficulty = "beginner" | "intermediate" | "advanced";
type TimeCommitment = "lt-2h" | "2-5h" | "5-10h" | "10h-plus";

export interface InventoryItem {
  id: string;
  name: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: TimeCommitment;
  components: string[];
  category: string;
  instructions: string[];
}

export interface GenerateParams {
  skill?: Difficulty;
  categories?: string[];
  components?: string[];
  time?: TimeCommitment;
  notes?: string;
}

interface AIProjectGeneratorProps {
  className?: string;
  style?: React.CSSProperties;
  inventory?: InventoryItem[];
  categories?: string[];
  defaultSkill?: Difficulty;
  defaultTime?: TimeCommitment;
  defaultSelectedComponentsIds?: string[];
  defaultSelectedCategories?: string[];
  onGenerate?: (params: GenerateParams) => Promise<ProjectIdea[]>;
  onSaveProject?: (project: ProjectIdea, saved: boolean) => void | Promise<void>;
  onShareProject?: (project: ProjectIdea) => void | Promise<void>;
  onViewDetails?: (project: ProjectIdea) => void | Promise<void>;
  initialProjects?: ProjectIdea[];
}

const DEFAULT_CATEGORIES = [
  "Robotics",
  "IoT",
  "Automation",
  "Wearables",
  "AI/ML",
  "Energy",
  "Environmental",
  "Home",
];

const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: "uno", name: "Arduino Uno" },
  { id: "esp32", name: "ESP32" },
  { id: "pi", name: "Raspberry Pi" },
  { id: "ldr", name: "LDR Sensor" },
  { id: "servo", name: "Servo Motor" },
  { id: "ultra", name: "Ultrasonic Sensor" },
  { id: "relay", name: "Relay Module" },
  { id: "stepper", name: "Stepper Motor" },
];

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const TIME_LABEL: Record<TimeCommitment, string> = {
  "lt-2h": "< 2 hours",
  "2-5h": "2–5 hours",
  "5-10h": "5–10 hours",
  "10h-plus": "10+ hours",
};

function difficultyBadgeColor(level: Difficulty) {
  switch (level) {
    case "beginner":
      return "bg-accent text-accent-foreground";
    case "intermediate":
      return "bg-secondary text-secondary-foreground";
    case "advanced":
      return "bg-primary text-primary-foreground";
  }
}

function timeBadgeColor(time: TimeCommitment) {
  switch (time) {
    case "lt-2h":
      return "bg-muted text-foreground";
    case "2-5h":
      return "bg-secondary text-secondary-foreground";
    case "5-10h":
      return "bg-accent text-accent-foreground";
    case "10h-plus":
      return "bg-primary text-primary-foreground";
  }
}

export default function AIProjectGenerator({
  className,
  style,
  inventory = DEFAULT_INVENTORY,
  categories = DEFAULT_CATEGORIES,
  defaultSkill,
  defaultTime,
  defaultSelectedComponentsIds,
  defaultSelectedCategories,
  onGenerate,
  onSaveProject,
  onShareProject,
  onViewDetails,
  initialProjects,
}: AIProjectGeneratorProps) {
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState<Difficulty | undefined>(defaultSkill);
  const [time, setTime] = useState<TimeCommitment | undefined>(defaultTime);
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>(
    defaultSelectedComponentsIds ?? []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    defaultSelectedCategories ?? []
  );
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectIdea[]>(initialProjects ?? []);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [detailProject, setDetailProject] = useState<ProjectIdea | null>(null);
  const [showApiError, setShowApiError] = useState(false);
  const [showPredefinedIdeas, setShowPredefinedIdeas] = useState(true);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  // Filter inventory by query
  const filteredInventory = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return inventory;
    return inventory.filter((i) => i.name.toLowerCase().includes(q));
  }, [inventory, query]);

  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  function toggleComponent(id: string) {
    setSelectedComponentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]
    );
  }

  function resetProgress() {
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
  }

  function startProgress() {
    resetProgress();
    setProgress(8);
    // Simulated smooth progress; final completion set when results arrive
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.max(1, Math.round((100 - p) / 20));
        return next >= 92 ? 92 : next;
      });
    }, 200);
  }

  function stopProgress() {
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(100);
    setTimeout(() => setProgress(0), 400);
  }

  async function handleGenerate() {
    setError(null);
    setIsGenerating(true);
    setShowPredefinedIdeas(false);
    startProgress();

    const params = {
      skill: skill || undefined,
      categories: selectedCategories,
      components: selectedComponentIds
        .map((id) => inventory.find((i) => i.id === id)?.name)
        .filter(Boolean) as string[],
      time: time || undefined,
      notes: notes.trim() || undefined,
    };

    try {
      // Show API error notification
      setShowApiError(true);
      
      // Use predefined ideas matching the selected components
      const selectedComponentNames = selectedComponentIds
        .map((id) => inventory.find((i) => i.id === id)?.name)
        .filter(Boolean) as string[];

      const matchingIdeas = PREDEFINED_IDEAS.filter(idea => {
        if (selectedComponentNames.length === 0) return true;
        return selectedComponentNames.some(selected =>
          idea.components.some(required =>
            required.toLowerCase().includes(selected.toLowerCase()) ||
            selected.toLowerCase().includes(required.toLowerCase())
          )
        );
      });

      // Get 2-3 matching ideas or fallback to first few
      const result = matchingIdeas.length > 0 
        ? matchingIdeas.slice(0, 3)
        : PREDEFINED_IDEAS.slice(0, 2);

      setProjects(result);
      
      if (!result.length) {
        toast("No ideas generated", {
          description:
            "Try adjusting categories, selecting different components, or changing skill level.",
        });
      } else {
        toast("Ideas ready! 🎯", {
          description: `Found ${result.length} project idea${result.length !== 1 ? 's' : ''} matching your components.`,
        });
      }
    } catch (e: any) {
      const msg = e?.message ?? "Failed to generate project ideas. Please try again.";
      setError(msg);
      toast("Generation failed", {
        description: msg,
      });
    } finally {
      setIsGenerating(false);
      stopProgress();
    }
  }

  function handlePredefinedIdeaSelect(idea: ProjectIdea) {
    setProjects([idea]);
    setShowPredefinedIdeas(false);
    toast("Idea selected! 💡", {
      description: "Ready to start building your project."
    });
  }

  function handleSave(project: ProjectIdea) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(project.id)) {
        next.delete(project.id);
        toast("Removed from saved", { description: project.title });
        onSaveProject?.(project, false);
      } else {
        next.add(project.id);
        toast("Saved", { description: project.title });
        onSaveProject?.(project, true);
      }
      return next;
    });
  }

  async function handleShare(project: ProjectIdea) {
    try {
      const shareText = `${project.title} • ${DIFFICULTY_LABEL[project.difficulty]} • ${TIME_LABEL[project.estimatedTime]}\n\n${project.description}`;
      const shareData = {
        title: project.title,
        text: shareText,
      };

      if (typeof window !== "undefined" && (navigator as any).share) {
        await (navigator as any).share(shareData);
        toast("Shared", { description: "Project shared successfully." });
      } else if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText}\n\nComponents: ${project.components.join(", ")}`);
        toast("Link copied", { description: "Project details copied to clipboard." });
      } else {
        toast("Share unavailable", { description: "Clipboard/Share not supported in this environment." });
      }

      onShareProject?.(project);
    } catch {
      toast("Share canceled", { description: "No worries, you can try again." });
    }
  }

  function openDetails(project: ProjectIdea) {
    setDetailProject(project);
    onViewDetails?.(project);
  }

  const hasFilters =
    (skill && skill.length > 0) ||
    (time && time.length > 0) ||
    selectedComponentIds.length > 0 ||
    selectedCategories.length > 0 ||
    notes.trim().length > 0;

  return (
    <section
      className={cn(
        "w-full bg-card text-card-foreground rounded-[var(--radius)] border border-border",
        className
      )}
      style={style}
      aria-labelledby="ai-generator-title"
    >
      <Card className="bg-card text-card-foreground border-0">
        <CardHeader className="gap-1">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <BrainCog className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <CardTitle id="ai-generator-title" className="text-lg sm:text-xl">
                AI Project Generator
              </CardTitle>
              <CardDescription className="text-sm">
                Select your components and preferences. Generate tailored STEM project ideas.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            {/* Inventory selector */}
            <div className="rounded-[calc(var(--radius)-6px)] border border-border bg-secondary p-4">
              <div className="flex items-center gap-2 mb-3">
                <Microchip className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-sm font-semibold">Your Components</h3>
              </div>
              <div className="space-y-3">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search components"
                  aria-label="Search components"
                  className="bg-card"
                />
                <div className="flex flex-wrap gap-2 min-w-0">
                  {filteredInventory.length === 0 ? (
                    <span className="text-sm text-muted-foreground">No components match your search.</span>
                  ) : (
                    filteredInventory.map((item) => {
                      const active = selectedComponentIds.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleComponent(item.id)}
                          aria-pressed={active}
                          aria-label={`${
                            active ? "Remove" : "Add"
                          } ${item.name}`}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "bg-card text-foreground border border-border hover:bg-muted"
                          )}
                        >
                          {item.name}
                        </button>
                      );
                    })
                  )}
                </div>
                {selectedComponentIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedComponentIds.map((id) => {
                      const comp = inventory.find((i) => i.id === id);
                      if (!comp) return null;
                      return (
                        <Badge key={id} variant="secondary" className="bg-accent text-accent-foreground">
                          {comp.name}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="rounded-[calc(var(--radius)-6px)] border border-border bg-secondary p-4">
              <div className="flex items-center gap-2 mb-3">
                <FolderKanban className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-sm font-semibold">Preferences</h3>
              </div>

              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <label htmlFor="skill" className="text-sm font-medium">
                    Skill level
                  </label>
                  <Select
                    value={skill}
                    onValueChange={(v: Difficulty) => setSkill(v)}
                  >
                    <SelectTrigger id="skill" className="bg-card">
                      <SelectValue placeholder="Choose level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="time" className="text-sm font-medium">
                    Time commitment
                  </label>
                  <Select
                    value={time}
                    onValueChange={(v: TimeCommitment) => setTime(v)}
                  >
                    <SelectTrigger id="time" className="bg-card">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lt-2h">&lt; 2 hours</SelectItem>
                      <SelectItem value="2-5h">2–5 hours</SelectItem>
                      <SelectItem value="5-10h">5–10 hours</SelectItem>
                      <SelectItem value="10h-plus">10+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5">
                  <span className="text-sm font-medium">Project categories</span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const active = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          aria-pressed={active}
                          aria-label={`${active ? "Remove" : "Add"} category ${cat}`}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "bg-card text-foreground border border-border hover:bg-muted"
                          )}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedCategories.map((c) => (
                        <Badge key={c} variant="secondary" className="bg-secondary text-secondary-foreground">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Additional customization
                  </label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Constraints, desired sensors/outputs, environments, or themes..."
                    className="min-h-24 bg-card"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Generate */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className={cn(
                "inline-flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90"
              )}
              aria-label="Generate Ideas"
            >
              {isGenerating ? (
                <>
                  <IterationCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Generating...
                </>
              ) : (
                <>
                  <BotMessageSquare className="h-4 w-4" aria-hidden="true" />
                  Generate Ideas
                </>
              )}
            </Button>

            <div className="flex-1 min-w-0">
              {isGenerating || progress > 0 ? (
                <div className="flex items-center gap-3">
                  <Progress value={progress} className="h-2 w-full" aria-label="Generation progress" />
                  <span className="text-sm text-muted-foreground min-w-[3ch]">
                    {Math.min(100, Math.max(0, Math.round(progress)))}%
                  </span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {hasFilters
                    ? "Ready to generate with your selected preferences."
                    : "Tip: Select components and categories to improve idea relevance."}
                </p>
              )}
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div
              role="alert"
              className="rounded-[calc(var(--radius)-6px)] border border-destructive bg-destructive/10 p-3"
            >
              <p className="text-sm text-destructive">
                {error}
              </p>
            </div>
          )}

          {/* Predefined Ideas Section */}
          {showPredefinedIdeas && projects.length === 0 && !isGenerating && (
            <PredefinedIdeas
              selectedComponents={selectedComponentIds.map((id) => inventory.find((i) => i.id === id)?.name).filter(Boolean) as string[]}
              onSelectIdea={handlePredefinedIdeaSelect}
            />
          )}

          {/* Results */}
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            {projects.length === 0 && !isGenerating ? (
              <Card className="bg-secondary border-dashed">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    <CardTitle className="text-base">No projects yet</CardTitle>
                  </div>
                  <CardDescription>
                    Use the controls above and press Generate Ideas to get tailored project suggestions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Suggestions:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Select at least 2–3 components from your inventory.</li>
                    <li>Pick a category and set your skill level.</li>
                    <li>Add constraints like budget, environment, or available tools.</li>
                  </ul>
                </CardContent>
              </Card>
            ) : (
              projects.map((p) => {
                const saved = savedIds.has(p.id);
                return (
                  <Card key={p.id} className="bg-card">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <CardTitle className="text-base sm:text-lg break-words">{p.title}</CardTitle>
                          <CardDescription className="mt-1 break-words">
                            {p.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className={cn("capitalize", difficultyBadgeColor(p.difficulty))}>
                            <InspectionPanel className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                            {DIFFICULTY_LABEL[p.difficulty]}
                          </Badge>
                          <Badge className={cn(timeBadgeColor(p.estimatedTime))}>
                            <SquareChartGantt className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                            {TIME_LABEL[p.estimatedTime]}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          {p.category}
                        </Badge>
                        {p.components.slice(0, 4).map((c) => (
                          <Badge key={c} variant="outline" className="bg-muted">
                            {c}
                          </Badge>
                        ))}
                        {p.components.length > 4 && (
                          <Badge variant="outline" className="bg-muted">
                            +{p.components.length - 4}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Workflow className="h-4 w-4 text-primary" />
                          Clear Steps to Build
                        </p>
                        <div className="space-y-2">
                          {p.instructions.slice(0, 3).map((step, idx) => (
                            <div key={idx} className="flex gap-3 text-sm">
                              <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
                                {idx + 1}
                              </div>
                              <p className="break-words text-muted-foreground leading-relaxed">{step}</p>
                            </div>
                          ))}
                          {p.instructions.length > 3 && (
                            <div className="flex gap-3 text-sm">
                              <div className="shrink-0 w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">
                                ...
                              </div>
                              <p className="text-muted-foreground">
                                {p.instructions.length - 3} more step{p.instructions.length - 3 !== 1 ? 's' : ''} in full details
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => handleSave(p)}
                          aria-pressed={saved}
                          aria-label={saved ? "Unsave project" : "Save project"}
                          className={cn(saved ? "bg-accent text-accent-foreground" : undefined)}
                        >
                          <FolderKanban className="h-4 w-4 mr-2" aria-hidden="true" />
                          {saved ? "Saved" : "Save"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleShare(p)}
                          aria-label="Share project"
                        >
                          <BotMessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
                          Share
                        </Button>
                      </div>
                      <Button
                        type="button"
                        onClick={() => openDetails(p)}
                        aria-label={`View details for ${p.title}`}
                      >
                        View details
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={!!detailProject} onOpenChange={(open) => !open && setDetailProject(null)}>
        <DialogContent className="max-w-2xl">
          {detailProject && (
            <>
              <DialogHeader>
                <DialogTitle className="break-words">{detailProject.title}</DialogTitle>
                <DialogDescription className="break-words">
                  {detailProject.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={cn("capitalize", difficultyBadgeColor(detailProject.difficulty))}>
                    <InspectionPanel className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    {DIFFICULTY_LABEL[detailProject.difficulty]}
                  </Badge>
                  <Badge className={cn(timeBadgeColor(detailProject.estimatedTime))}>
                    <SquareChartGantt className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    {TIME_LABEL[detailProject.estimatedTime]}
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    {detailProject.category}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-1">Required components</p>
                  <div className="flex flex-wrap gap-1.5">
                    {detailProject.components.map((c) => (
                      <Badge key={c} variant="outline" className="bg-muted">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    Full instructions
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    {detailProject.instructions.map((step, idx) => (
                      <li key={idx} className="break-words">{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      handleShare(detailProject);
                    }}
                  >
                    <BotMessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
                    Share
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      handleSave(detailProject);
                      setDetailProject(null);
                    }}
                  >
                    <FolderKanban className="h-4 w-4 mr-2" aria-hidden="true" />
                    Save
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* API Error Notification */}
      <ApiErrorNotification
        show={showApiError}
        onClose={() => setShowApiError(false)}
      />
    </section>
  );
}

/**
 * Fallback mock generator to keep the component functional in isolation.
 * Replace by passing `onGenerate` prop to integrate with your API.
 */
async function mockGenerate(params: GenerateParams): Promise<ProjectIdea[]> {
  // Simulate API latency
  await new Promise((r) => setTimeout(r, 1400 + Math.random() * 600));

  const comps = params.components?.length ? params.components : ["ESP32", "DHT11", "Servo Motor"];
  const cats = params.categories?.length ? params.categories : ["IoT", "Automation", "Environmental"];
  const level: Difficulty = (params.skill ?? "beginner") as Difficulty;
  const time = (params.time ?? "2-5h") as TimeCommitment;

  const base: ProjectIdea[] = [
    {
      id: "p-" + Math.random().toString(36).slice(2),
      title: "Smart Home Air Quality Monitor",
      description:
        "Build a connected monitor that tracks temperature and humidity, displays status, and sends alerts when thresholds are exceeded.",
      difficulty: level,
      estimatedTime: time,
      components: uniqueList([...comps, "OLED Display"]),
      category: cats[0] ?? "IoT",
      instructions: [
        "Wire the sensor to the microcontroller and verify readings via serial monitor.",
        "Display live metrics on the OLED with color-coded thresholds.",
        "Push readings to a cloud endpoint and configure alert rules.",
        "Enclose the device and test in different rooms.",
      ],
    },
    {
      id: "p-" + Math.random().toString(36).slice(2),
      title: "Obstacle-Avoiding Bot",
      description:
        "Assemble a simple robot that navigates autonomously by detecting obstacles and adjusting its path.",
      difficulty: level === "beginner" ? "beginner" : level,
      estimatedTime: time,
      components: uniqueList([...comps, "Ultrasonic Sensor", "Motor Driver"]),
      category: cats[1] ?? "Robotics",
      instructions: [
        "Mount motors and connect the driver to the controller.",
        "Integrate the ultrasonic sensor and read distance values.",
        "Implement basic avoidance logic with turn-and-forward behavior.",
        "Tune speed and sensitivity; test in a small course.",
      ],
    },
    {
      id: "p-" + Math.random().toString(36).slice(2),
      title: "Automated Plant Watering System",
      description:
        "Create a soil-moisture-based watering setup that irrigates plants automatically and logs activity.",
      difficulty: level,
      estimatedTime: time,
      components: uniqueList([...comps, "Soil Moisture Sensor", "Relay Module", "Pump"]),
      category: cats[2] ?? "Automation",
      instructions: [
        "Calibrate the moisture sensor to determine dry thresholds.",
        "Control a pump using a relay and implement safety delays.",
        "Log watering events and moisture trends for analysis.",
        "Add a manual override and status LED.",
      ],
    },
  ];

  // Small chance to return empty to simulate edge
  if (Math.random() < 0.05) return [];

  return base;
}

function uniqueList<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}