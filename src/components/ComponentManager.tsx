"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  CircuitBoard,
  Filter,
  GridIcon,
  IterationCw,
  Search,
  ShoppingCart,
  Microchip,
  Minus,
  Plus,
  X,
  Eye,
  Package,
  CheckSquare,
  Square,
  Trash2,
  ArrowUp,
  ArrowDown,
  Cpu,
  Zap,
  Gauge,
  Wifi,
  Monitor,
  Battery,
  Layers,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { apiService, Component } from "@/services/apiService";
import AddComponentForm from "./AddComponentForm";

export interface ComponentItem {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  available: boolean;
  price?: string;
  image?: string;
  specifications?: { [key: string]: string };
}

interface ComponentManagerProps {
  className?: string;
  style?: React.CSSProperties;
  items?: ComponentItem[];
  onAddItem?: (item: ComponentItem) => void;
  onRemoveItem?: (id: string) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onBulkRemove?: (ids: string[]) => void;
  onBulkQuantityAdjust?: (ids: string[], delta: number) => void;
}

// Component categories with icons
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'microcontrollers': return Cpu;
    case 'sensors': return Gauge;
    case 'actuators': return Zap;
    case 'communication': return Wifi;
    case 'displays': return Monitor;
    case 'power': return Battery;
    default: return Layers;
  }
};

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'Available':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'Partially Available':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    case 'Not Available':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
};

export default function ComponentManager({
  className,
  style,
  items,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
  onBulkRemove,
  onBulkQuantityAdjust,
}: ComponentManagerProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "category" | "price">("name");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [detailItem, setDetailItem] = useState<Component | null>(null);
  const [localSelectedComponents, setLocalSelectedComponents] = useState<ComponentItem[]>([]);

  // Fetch components from API
  const { data: components = [], isLoading, error } = useQuery({
    queryKey: ['components'],
    queryFn: () => apiService.getComponents(),
  });

  // Convert API components to ComponentItems
  const convertedItems = useMemo(() => {
    return components.map((comp): ComponentItem => ({
      id: comp.id,
      name: comp.name,
      description: comp.description,
      category: comp.category,
      quantity: 1, // Default quantity for browsing
      available: comp.availability === 'Available',
      price: comp.price_range,
      specifications: comp.specifications,
    }));
  }, [components]);

  // Use local items if provided, otherwise use converted API items
  const displayItems = items || convertedItems;

  // Get all available categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(displayItems.map((item) => item.category)));
    return ["All", ...cats.sort()];
  }, [displayItems]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = displayItems.filter((item) => {
      const matchesQuery =
        query === "" ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "category":
          return a.category.localeCompare(b.category);
        case "price":
          return (a.price || "").localeCompare(b.price || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [displayItems, query, selectedCategory, sortBy]);

  // Toggle component selection
  const toggleComponentSelection = (component: ComponentItem) => {
    const isSelected = localSelectedComponents.some(comp => comp.id === component.id);
    let newSelection;
    
    if (isSelected) {
      newSelection = localSelectedComponents.filter(comp => comp.id !== component.id);
      toast.success(`Removed ${component.name}`);
      onRemoveItem?.(component.id); // Notify parent to remove
    } else {
      newSelection = [...localSelectedComponents, component];
      toast.success(`Added ${component.name}`);
      onAddItem?.(component); // Notify parent to add
    }
    
    setLocalSelectedComponents(newSelection);
  };

  const handleComponentClick = (component: Component) => {
    setDetailItem(component);
  };

  const handleAddToProject = (component: Component) => {
    const componentItem: ComponentItem = {
      id: component.id,
      name: component.name,
      description: component.description,
      category: component.category,
      quantity: 1,
      available: component.availability === 'Available',
      price: component.price_range,
      specifications: component.specifications,
    };
    
    toggleComponentSelection(componentItem);
  };

  if (isLoading) {
    return (
      <section className={cn("w-full bg-card text-card-foreground rounded-[var(--radius)] border border-border", className)}>
        <Card className="bg-card text-card-foreground border-0">
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading components...</p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn("w-full bg-card text-card-foreground rounded-[var(--radius)] border border-border", className)}>
        <Card className="bg-card text-card-foreground border-0">
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-medium text-destructive mb-2">Failed to Load Components</h3>
              <p className="text-muted-foreground mb-4">Please check your connection and try again.</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "w-full bg-card text-card-foreground rounded-[var(--radius)] border border-border",
        className
      )}
      style={style}
      aria-labelledby="component-manager-title"
    >
      <Card className="bg-card text-card-foreground border-0">
        <CardHeader className="gap-1">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <CircuitBoard className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <CardTitle id="component-manager-title" className="text-lg sm:text-xl">
                Component Database
              </CardTitle>
              <CardDescription className="text-sm">
                {displayItems.length} total • {filteredItems.length} shown • {localSelectedComponents.length} selected
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mobile-optimized Controls */}
          <div className="flex flex-col gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search components..."
                className="pl-10 h-12 text-base"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="flex-1 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="flex-1 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Insert Component Button */}
            <div className="flex justify-center pt-2">
              <AddComponentForm 
                onComponentAdded={(component) => {
                  // Refresh the component list
                  window.location.reload();
                }}
              />
            </div>
          </div>

          {/* Selected Components Summary */}
          {localSelectedComponents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-accent rounded-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {localSelectedComponents.length} component{localSelectedComponents.length !== 1 ? 's' : ''} selected for your project
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setLocalSelectedComponents([])}
                  className="h-8"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {localSelectedComponents.slice(0, 5).map((comp) => (
                  <Badge key={comp.id} variant="secondary" className="text-xs">
                    {comp.name}
                  </Badge>
                ))}
                {localSelectedComponents.length > 5 && (
                  <Badge variant="secondary" className="text-xs">
                    +{localSelectedComponents.length - 5} more
                  </Badge>
                )}
              </div>
            </motion.div>
          )}

          {/* Mobile-optimized Components Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                <Filter className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No components found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((component, index) => {
                const isSelected = localSelectedComponents.some(comp => comp.id === component.id);
                const CategoryIcon = getCategoryIcon(component.category);
                
                return (
                  <motion.div
                    key={component.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-4 cursor-pointer transition-all duration-200 hover:shadow-lg rounded-lg border touch-manipulation",
                      isSelected ? 'ring-2 ring-primary bg-primary/5 border-primary/20' : 'border-border hover:border-border/80'
                    )}
                    onClick={() => toggleComponentSelection(component)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <motion.div 
                        className={cn(
                          "p-3 rounded-lg transition-all duration-300",
                          isSelected 
                            ? 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg' 
                            : 'bg-secondary'
                        )}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <CategoryIcon className="h-6 w-6" />
                      </motion.div>
                      
                      <motion.span 
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-all duration-300",
                          getAvailabilityColor(component.available ? 'Available' : 'Not Available')
                        )}
                        whileHover={{ scale: 1.05 }}
                      >
                        {component.available ? 'Available' : 'Out of Stock'}
                      </motion.span>
                    </div>
                    
                    <h3 className="font-semibold mb-2 text-base">{component.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {component.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-primary">
                        {component.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {component.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleComponentSelection(component);
                        }}
                        className={cn(
                          "flex-1 text-sm py-3 h-12",
                          isSelected ? "bg-primary hover:bg-primary/90" : ""
                        )}
                        variant={isSelected ? "default" : "secondary"}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isSelected ? 'Added' : 'Add to Project'}
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Convert ComponentItem back to Component for detail view
                          const comp: Component = {
                            id: component.id,
                            name: component.name,
                            description: component.description,
                            category: component.category,
                            price_range: component.price || '',
                            availability: component.available ? 'Available' : 'Not Available',
                            specifications: component.specifications
                          };
                          handleComponentClick(comp);
                        }}
                        variant="outline"
                        className="text-sm py-3 px-4 h-12"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="mt-3 text-center"
                      >
                        <motion.span 
                          className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg"
                          animate={{ 
                            boxShadow: [
                              "0 4px 14px 0 rgba(139, 92, 246, 0.3)",
                              "0 6px 20px 0 rgba(139, 92, 246, 0.5)",
                              "0 4px 14px 0 rgba(139, 92, 246, 0.3)"
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          ✓ Selected
                        </motion.span>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile-optimized Component Detail Modal */}
      {detailItem && (
        <Dialog open={!!detailItem} onOpenChange={(open) => !open && setDetailItem(null)}>
          <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-secondary">
                    {React.createElement(getCategoryIcon(detailItem.category), {
                      className: "h-6 w-6 text-primary"
                    })}
                  </div>
                  {detailItem.name}
                </DialogTitle>
                <DialogDescription className="text-base">{detailItem.description}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-sm py-1">{detailItem.category}</Badge>
                  <Badge className={cn(getAvailabilityColor(detailItem.availability), "text-sm py-1")}>
                    {detailItem.availability}
                  </Badge>
                  <span className="text-lg font-medium text-primary">
                    {detailItem.price_range}
                  </span>
                </div>

                {detailItem.specifications && Object.keys(detailItem.specifications).length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">Specifications</h3>
                    <div className="bg-secondary p-4 rounded-lg space-y-2">
                      {Object.entries(detailItem.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm py-1">
                          <span className="text-muted-foreground capitalize">
                            {key.replace('_', ' ')}:
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleAddToProject(detailItem);
                      setDetailItem(null);
                    }}
                    className="flex-1 h-12 text-base"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    <span>Add to Project</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}