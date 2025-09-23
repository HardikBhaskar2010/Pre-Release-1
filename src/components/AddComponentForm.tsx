"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Plus,
  X,
  Package,
  DollarSign,
  Tag,
  FileText,
  Sparkles,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService, Component } from "@/services/apiService";

interface AddComponentFormProps {
  onComponentAdded?: (component: Component) => void;
  trigger?: React.ReactNode;
}

const CATEGORIES = [
  "Microcontrollers",
  "Sensors",
  "Actuators", 
  "Communication",
  "Displays",
  "Power",
  "Passive Components",
  "Development Boards",
  "Motors & Drives",
  "Audio & Video",
  "Storage",
  "Other"
];

const AVAILABILITY_OPTIONS = [
  "Available",
  "Partially Available", 
  "Not Available"
] as const;

export default function AddComponentForm({ onComponentAdded, trigger }: AddComponentFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price_range: "",
    availability: "Available" as const,
    specifications: {} as Record<string, string>
  });
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newComponent = await apiService.addComponent(formData);
      
      toast.success("Component added successfully! 🎉", {
        description: `${newComponent.name} has been added to the database`
      });
      
      onComponentAdded?.(newComponent);
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        price_range: "",
        availability: "Available",
        specifications: {}
      });
      setSpecKey("");
      setSpecValue("");
      setOpen(false);
      
    } catch (error) {
      toast.error("Failed to add component", {
        description: "Please try again or contact support if the issue persists"
      });
      console.error("Error adding component:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: specValue
        }
      }));
      setSpecKey("");
      setSpecValue("");
    }
  };

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const defaultTrigger = (
    <Button className="gap-2 bg-primary text-primary-foreground hover:opacity-90">
      <Plus className="h-4 w-4" />
      Insert Component
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            Add New Component
          </DialogTitle>
          <DialogDescription>
            Add a new electronic component to the database for all users to discover and use 📥
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Component Name *
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Arduino Uno R3, HC-SR04 Ultrasonic Sensor"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the component, its main features and typical use cases..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Category *
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="availability" className="block text-sm font-medium mb-1">
                    Availability
                  </label>
                  <Select
                    value={formData.availability}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, availability: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABILITY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label htmlFor="price_range" className="block text-sm font-medium mb-1">
                  Price Range
                </label>
                <Input
                  id="price_range"
                  value={formData.price_range}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_range: e.target.value }))}
                  placeholder="e.g., $5-10, $25-35, Contact for pricing"
                />
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Specifications
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  placeholder="Specification name (e.g., Voltage)"
                />
                <div className="flex gap-2">
                  <Input
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    placeholder="Value (e.g., 3.3-5V)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecification())}
                  />
                  <Button
                    type="button"
                    onClick={addSpecification}
                    disabled={!specKey || !specValue}
                    size="sm"
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {Object.keys(formData.specifications).length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Current Specifications:</p>
                  <div className="space-y-2">
                    {Object.entries(formData.specifications).map(([key, value]) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {key}
                          </Badge>
                          <span className="text-sm">{value}</span>
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeSpecification(key)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.description || !formData.category}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Adding...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Add Component
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}