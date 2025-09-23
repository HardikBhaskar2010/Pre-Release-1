"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import ComponentManager from "@/components/ComponentManager";
import { ComponentItem } from "@/components/ComponentManager";
import { Plus, Database, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ComponentsPage() {
  const [inventory, setInventory] = useState<ComponentItem[]>([]);

  const handleAddComponent = (item: ComponentItem) => {
    setInventory(prev => {
      const exists = prev.find(i => i.id === item.id);
      return exists
        ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [item, ...prev];
    });
  };

  const handleRemoveComponent = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, quantity, available: quantity > 0 } : i));
  };

  const handleBulkRemove = (ids: string[]) => {
    setInventory(prev => prev.filter(i => !ids.includes(i.id)));
  };

  const handleBulkAdjust = (ids: string[], delta: number) => {
    setInventory(prev => prev.map(i => {
      if (!ids.includes(i.id)) return i;
      const q = Math.max(0, i.quantity + delta);
      return { ...i, quantity: q, available: q > 0 };
    }));
  };

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
          <div className="mt-4">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <Database className="h-6 w-6 text-primary" />
              Component Database
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse and manage electronic components for your STEM projects 🔧
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Component Manager */}
          <div className="lg:col-span-2">
            <ComponentManager
              items={inventory}
              onAddItem={handleAddComponent}
              onRemoveItem={handleRemoveComponent}
              onUpdateQuantity={handleUpdateQuantity}
              onBulkRemove={handleBulkRemove}
              onBulkQuantityAdjust={handleBulkAdjust}
            />
          </div>

          {/* Your Inventory Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Your Inventory
                </CardTitle>
                <CardDescription>
                  Components selected for your projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inventory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground mb-4">
                      <Database className="h-12 w-12 mx-auto opacity-50" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No components selected yet. Browse the database and add components to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inventory.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {item.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="secondary" className="text-xs">
                            Qty: {item.quantity}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveComponent(item.id)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          >
                            ×
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                    <div className="pt-3 border-t">
                      <Link href="/?scroll=generator">
                        <Button className="w-full" size="sm">
                          Generate Ideas with These Components
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}