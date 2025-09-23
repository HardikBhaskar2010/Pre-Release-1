"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Kanban,
  FolderArchive,
  FolderCheck,
  ListTodo,
  NotebookTabs,
  SquareKanban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

type ProjectStatus = "saved" | "in-progress" | "completed";

export type Project = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  status: ProjectStatus;
  dateSaved: string; // ISO date string
  instructions: string;
  requirements: string[]; // components or steps required
  notes?: string;
};

type SortKey = "date" | "difficulty" | "status";

export interface ProjectLibraryProps {
  className?: string;
  style?: React.CSSProperties;
  projects?: Project[];
  /**
   * Optional handlers to sync state to server or parent store.
   * If omitted, the component manages state locally.
   */
  onUpdateProject?: (id: string, update: Partial<Project>) => void;
  onDeleteProjects?: (ids: string[]) => void;
  onBulkUpdateStatus?: (ids: string[], status: ProjectStatus) => void;
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; icon: React.ElementType; className: string; dotClass: string }
> = {
  saved: {
    label: "Saved",
    icon: FolderArchive,
    className:
      "bg-secondary text-foreground hover:bg-secondary/90 border border-border",
    dotClass: "bg-muted-foreground/60",
  },
  "in-progress": {
    label: "In Progress",
    icon: Kanban,
    className: "bg-accent text-accent-foreground hover:bg-accent/90",
    dotClass: "bg-chart-2",
  },
  completed: {
    label: "Completed",
    icon: FolderCheck,
    className: "bg-primary text-primary-foreground hover:bg-primary/90",
    dotClass: "bg-primary-foreground/90",
  },
};

function useClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

export default function ProjectLibrary({
  className,
  style,
  projects: initialProjects,
  onUpdateProject,
  onDeleteProjects,
  onBulkUpdateStatus,
}: ProjectLibraryProps) {
  const isClient = useClient();

  const [projects, setProjects] = useState<Project[]>(
    initialProjects ?? defaultSeed
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  // Derived data
  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter)
        return false;
      if (!q) return true;
      const hay =
        `${p.title} ${p.category} ${p.tags.join(" ")} ${p.instructions} ${p.requirements.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });

    list = list.sort((a, b) => {
      if (sortKey === "date") {
        return new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime();
      }
      if (sortKey === "difficulty") {
        const rank = { beginner: 0, intermediate: 1, advanced: 2 } as const;
        return rank[a.difficulty] - rank[b.difficulty];
      }
      // status
      const order: Record<ProjectStatus, number> = {
        "in-progress": 0,
        saved: 1,
        completed: 2,
      };
      return order[a.status] - order[b.status];
    });

    return list;
  }, [projects, query, statusFilter, categoryFilter, sortKey]);

  const allVisibleSelected = useMemo(() => {
    if (filtered.length === 0) return false;
    return filtered.every((p) => selected.has(p.id));
  }, [filtered, selected]);

  // Selection handlers
  const toggleSelectAllVisible = (checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) {
        filtered.forEach((p) => next.add(p.id));
      } else {
        filtered.forEach((p) => next.delete(p.id));
      }
      return next;
    });
  };

  const toggleSelect = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  // Project updates
  const updateProject = (id: string, patch: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
    onUpdateProject?.(id, patch);
  };

  const bulkUpdateStatus = (ids: string[], status: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, status } : p))
    );
    onBulkUpdateStatus?.(ids, status);
    toast.success(`Updated ${ids.length} project${ids.length > 1 ? "s" : ""} to ${statusConfig[status].label}`);
    setSelected(new Set());
  };

  const bulkDelete = (ids: string[]) => {
    setProjects((prev) => prev.filter((p) => !ids.includes(p.id)));
    onDeleteProjects?.(ids);
    toast.success(`Deleted ${ids.length} project${ids.length > 1 ? "s" : ""}`);
    setSelected(new Set());
  };

  // Export helpers
  const exportProjects = (ids: string[]) => {
    try {
      const payload = projects.filter((p) => ids.includes(p.id));
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        ids.length === 1
          ? `project-${ids[0]}.json`
          : `projects-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Export started");
    } catch {
      toast.error("Export failed");
    }
  };

  // Detail dialog controls
  const openDetail = (p: Project) => {
    setDetailProject(p);
    setNotesDraft(p.notes ?? "");
  };

  const closeDetail = () => {
    setDetailProject(null);
    setNotesDraft("");
  };

  const saveNotes = () => {
    if (!detailProject) return;
    updateProject(detailProject.id, { notes: notesDraft });
    toast.success("Notes saved");
  };

  const shareProject = async (p: Project) => {
    const text = `Check out this project idea: ${p.title}\n\nCategory: ${p.category}\nDifficulty: ${capitalize(
      p.difficulty
    )}\nStatus: ${statusConfig[p.status].label}\n\nInstructions:\n${p.instructions}\n\n#AtalIdeaGenerator`;
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({
          title: p.title,
          text,
        });
        toast.success("Shared successfully");
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        toast.success("Copied share text to clipboard");
        return;
      }
      toast.message("Share not supported on this device");
    } catch {
      toast.error("Share failed");
    }
  };

  return (
    <section
      className={cn(
        "w-full max-w-full bg-background",
        "rounded-lg",
        className
      )}
      style={style}
      aria-label="Project library"
    >
      {/* Toolbar */}
      <div className="w-full max-w-full bg-card border border-border rounded-lg p-3 sm:p-4 md:p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <SquareKanban className="size-5 shrink-0 text-primary" aria-hidden />
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight min-w-0">
                <span className="truncate block">Project Library</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="bg-secondary hover:bg-secondary/90"
                onClick={() => exportProjects(projects.map((p) => p.id))}
                aria-label="Export all projects"
              >
                Export all
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="flex-1 min-w-0">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, tags, components, or instructions..."
                aria-label="Search projects"
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(v: ProjectStatus | "all") => setStatusFilter(v)}
              >
                <SelectTrigger className="w-[160px] bg-secondary">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="saved">Saved</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                value={categoryFilter}
                onValueChange={(v: string | "all") => setCategoryFilter(v)}
              >
                <SelectTrigger className="w-[180px] bg-secondary">
                  <SelectValue placeholder="Filter category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem value={c} key={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select value={sortKey} onValueChange={(v: SortKey) => setSortKey(v)}>
                <SelectTrigger className="w-[180px] bg-secondary">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="date">Date saved</SelectItem>
                    <SelectItem value="difficulty">Difficulty</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk actions bar */}
          {selected.size > 0 && (
            <div
              className={cn(
                "w-full rounded-md border border-border bg-muted/60 px-3 py-2 sm:px-4 sm:py-3",
                "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3",
                "animate-in fade-in slide-in-from-top-2"
              )}
              role="region"
              aria-live="polite"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Checkbox
                  checked={allVisibleSelected}
                  onCheckedChange={(c) => toggleSelectAllVisible(Boolean(c))}
                  aria-label={allVisibleSelected ? "Deselect all" : "Select all"}
                />
                <p className="text-sm text-muted-foreground truncate">
                  {selected.size} selected
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-secondary hover:bg-secondary/90"
                  onClick={() =>
                    bulkUpdateStatus(Array.from(selected), "in-progress")
                  }
                >
                  Mark In Progress
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-secondary hover:bg-secondary/90"
                  onClick={() => bulkUpdateStatus(Array.from(selected), "completed")}
                >
                  Mark Completed
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => bulkDelete(Array.from(selected))}
                >
                  Delete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportProjects(Array.from(selected))}
                >
                  Export
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {filtered.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            selected={selected.has(p.id)}
            onToggleSelect={(c) => toggleSelect(p.id, c)}
            onOpen={() => openDetail(p)}
            onStatusChange={(status) => updateProject(p.id, { status })}
            onExport={() => exportProjects([p.id])}
            onShare={() => shareProject(p)}
          />
        ))}
        {filtered.length === 0 && (
          <Card className="col-span-full bg-card border-dashed border-2">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">No projects found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search or filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!detailProject} onOpenChange={(o) => (!o ? closeDetail() : null)}>
        <DialogContent
          className="max-w-3xl w-full bg-card"
          aria-describedby="project-dialog-description"
        >
          {detailProject && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <StatusBadge status={detailProject.status} />
                  <div className="min-w-0">
                    <DialogTitle className="text-lg sm:text-xl truncate">
                      {detailProject.title}
                    </DialogTitle>
                    <DialogDescription id="project-dialog-description" className="sr-only">
                      Detailed project view with instructions, requirements, and notes
                    </DialogDescription>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <Badge variant="outline" className="capitalize">
                        {detailProject.category}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {detailProject.difficulty}
                      </Badge>
                      {detailProject.tags.slice(0, 4).map((t) => (
                        <Badge key={t} variant="secondary" className="capitalize">
                          {t}
                        </Badge>
                      ))}
                      {detailProject.tags.length > 4 && (
                        <Badge variant="secondary">+{detailProject.tags.length - 4}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="instructions" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  <TabsTrigger value="requirements">Components</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="instructions" className="mt-4">
                  <ScrollArea className="h-[260px] rounded-md border border-border">
                    <div className="p-4">
                      <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed break-words">
                        {detailProject.instructions}
                      </p>
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="requirements" className="mt-4">
                  <div className="rounded-md border border-border">
                    <div className="flex items-center gap-2 p-3 border-b border-border">
                      <ListTodo className="size-4 text-muted-foreground" aria-hidden />
                      <p className="text-sm font-medium">Required Components</p>
                    </div>
                    <ScrollArea className="h-[220px]">
                      <ul className="p-4 space-y-2">
                        {detailProject.requirements.map((r, i) => (
                          <li
                            key={`${detailProject.id}-req-${i}`}
                            className="text-sm break-words"
                          >
                            • {r}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                </TabsContent>
                <TabsContent value="notes" className="mt-4">
                  <div className="rounded-md border border-border">
                    <div className="flex items-center gap-2 p-3 border-b border-border">
                      <NotebookTabs className="size-4 text-muted-foreground" aria-hidden />
                      <p className="text-sm font-medium">Personal Notes</p>
                    </div>
                    <div className="p-3">
                      <Textarea
                        value={notesDraft}
                        onChange={(e) => setNotesDraft(e.target.value)}
                        placeholder="Add your notes..."
                        className="min-h-[160px] resize-y"
                        aria-label="Project notes"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-2" />
              <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" className="bg-secondary hover:bg-secondary/90">
                        Change status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Set status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          updateProject(detailProject.id, { status: "saved" })
                        }
                      >
                        <FolderArchive className="mr-2 size-4" /> Saved
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateProject(detailProject.id, { status: "in-progress" })
                        }
                      >
                        <Kanban className="mr-2 size-4" /> In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateProject(detailProject.id, { status: "completed" })
                        }
                      >
                        <FolderCheck className="mr-2 size-4" /> Completed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="outline"
                    onClick={() => exportProjects([detailProject.id])}
                  >
                    Export
                  </Button>
                  <Button variant="outline" onClick={() => shareProject(detailProject)}>
                    Share
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <DialogClose asChild>
                    <Button variant="secondary" className="bg-secondary hover:bg-secondary/90">
                      Close
                    </Button>
                  </DialogClose>
                  <Button onClick={saveNotes}>Save notes</Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ProjectCard({
  project,
  selected,
  onToggleSelect,
  onOpen,
  onStatusChange,
  onExport,
  onShare,
}: {
  project: Project;
  selected: boolean;
  onToggleSelect: (checked: boolean) => void;
  onOpen: () => void;
  onStatusChange: (s: ProjectStatus) => void;
  onExport: () => void;
  onShare: () => void;
}) {
  const StatusIcon = statusConfig[project.status].icon;

  return (
    <Card
      className={cn(
        "group bg-card border-border transition-colors focus-within:ring-2 focus-within:ring-ring outline-none",
        selected ? "ring-1 ring-primary/60" : ""
      )}
      role="article"
    >
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Checkbox
              checked={selected}
              onCheckedChange={(c) => onToggleSelect(Boolean(c))}
              aria-label={selected ? "Deselect project" : "Select project"}
            />
            <div className="min-w-0">
              <CardTitle className="text-base md:text-lg truncate">{project.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="capitalize">
                  {project.category}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {project.difficulty}
                </Badge>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open project actions">
                <span className="sr-only">Open actions</span>
                <span className="inline-block size-1.5 rounded-full bg-muted-foreground/70 shadow-[0_0_0_4px_var(--color-card)]" />
                <span className="inline-block size-1.5 rounded-full bg-muted-foreground/70 ml-0.5" />
                <span className="inline-block size-1.5 rounded-full bg-muted-foreground/70 ml-0.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onOpen}>Open details</DropdownMenuItem>
              <DropdownMenuItem onClick={onShare}>Share</DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onStatusChange("saved")}>
                Move to Saved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("in-progress")}>
                Mark In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("completed")}>
                Mark Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <StatusBadge status={project.status} />
            <p className="text-xs text-muted-foreground">
              Saved {new Date(project.dateSaved).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {project.tags.slice(0, 3).map((t) => (
              <Badge key={t} variant="outline" className="capitalize">
                {t}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline">+{project.tags.length - 3}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.instructions}
        </p>
        <div className="flex items-center justify-between mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpen}
            aria-label={`Open ${project.title}`}
          >
            View details
          </Button>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                onStatusChange(
                  project.status === "saved"
                    ? "in-progress"
                    : project.status === "in-progress"
                    ? "completed"
                    : "saved"
                )
              }
              aria-label="Cycle status"
              title="Cycle status"
            >
              <StatusIcon className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onShare} aria-label="Share project">
              <NotebookTabs className="size-4 rotate-90 opacity-80" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const { label, icon: Icon, className, dotClass } = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium",
        className
      )}
      aria-label={`Status: ${label}`}
    >
      <span className={cn("size-1.5 rounded-full", dotClass)} />
      <Icon className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}

function capitalize<T extends string>(s: T): Capitalize<T> {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<T>;
}

// Seed data (can be removed in production usage by providing props.projects)
const defaultSeed: Project[] = [
  {
    id: "p-001",
    title: "Smart Plant Watering System",
    category: "IoT",
    tags: ["arduino", "sensors", "water", "automation"],
    difficulty: "intermediate",
    status: "saved",
    dateSaved: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    instructions:
      "Build an automated plant watering system using a soil moisture sensor and a microcontroller. Program logic to trigger a pump when moisture falls below a threshold. Add calibration routine and safety timeout.",
    requirements: [
      "Microcontroller (Arduino or similar)",
      "Soil moisture sensor",
      "Relay or MOSFET driver",
      "Water pump + tubing",
      "12V power supply",
      "Jumper wires and breadboard",
    ],
    notes: "Consider waterproof housing and power-safe relays.",
  },
  {
    id: "p-002",
    title: "Line Following Robot",
    category: "Robotics",
    tags: ["motors", "control", "IR", "PID"],
    difficulty: "advanced",
    status: "in-progress",
    dateSaved: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    instructions:
      "Assemble a two-wheel differential drive robot. Use IR reflectance sensors to detect line position. Implement a PID controller to minimize error and follow the line smoothly. Tune gains experimentally.",
    requirements: [
      "Microcontroller (Arduino/ESP32)",
      "IR sensor array",
      "Motor driver (L298N or similar)",
      "Chassis + DC motors + wheels",
      "Battery pack",
      "Caster wheel",
    ],
  },
  {
    id: "p-003",
    title: "Weather Station Dashboard",
    category: "Data",
    tags: ["api", "web", "sensors", "display"],
    difficulty: "beginner",
    status: "completed",
    dateSaved: new Date().toISOString(),
    instructions:
      "Create a weather station that reads temperature, humidity, and pressure. Display data on an LCD and publish to a simple web dashboard. Use debouncing and averaging for stable readings.",
    requirements: [
      "ESP32",
      "BME280 sensor",
      "16x2 LCD or OLED display",
      "Resistors and wires",
      "Breadboard",
      "Web server or cloud endpoint",
    ],
    notes: "Add data logging with microSD for historical trends.",
  },
];