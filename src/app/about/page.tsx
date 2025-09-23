"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BrainCog, CircuitBoard, Goal, FolderKanban, Zap, Heart, Users, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: BrainCog,
    title: "AI-Powered Generation",
    description: "Smart project suggestions tailored to your available components and skill level",
    color: "text-blue-500"
  },
  {
    icon: CircuitBoard,
    title: "Component Database",
    description: "Extensive library of electronic components with specifications and compatibility info",
    color: "text-green-500"
  },
  {
    icon: Goal,
    title: "Skill-Based Matching",
    description: "Projects matched to your experience level, from beginner to advanced maker",
    color: "text-purple-500"
  },
  {
    icon: FolderKanban,
    title: "Project Management",
    description: "Save, organize, and track your project ideas with built-in progress tracking",
    color: "text-orange-500"
  }
];

const stats = [
  { label: "Components", value: "500+", icon: CircuitBoard },
  { label: "Project Ideas", value: "∞", icon: Zap },
  { label: "Skill Levels", value: "3", icon: Goal },
  { label: "Categories", value: "8+", icon: FolderKanban }
];

export default function AboutPage() {
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
              <Heart className="h-6 w-6 text-red-500" />
              About Atal Idea Generator
            </h1>
            <p className="text-muted-foreground mt-1">
              Empowering STEM innovation through AI-assisted project discovery 🚀
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-12">
        
        {/* Mission Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Our Mission
              </CardTitle>
              <CardDescription>
                Transforming the way students and makers approach STEM projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Atal Idea Generator bridges the gap between having electronic components and knowing what to build with them. 
                We believe that every resistor, sensor, and microcontroller has the potential to become part of something amazing – 
                you just need the right idea to get started.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our AI-powered platform analyzes your available components, considers your skill level, and generates 
                personalized project ideas that are both educational and achievable. Whether you're a beginner taking 
                your first steps in electronics or an advanced maker looking for inspiration, we're here to help you 
                turn ideas into reality.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Features Grid */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold mb-2">Why Choose Atal Idea Generator?</h2>
            <p className="text-muted-foreground">Features designed to accelerate your STEM journey</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-secondary ${feature.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                By the Numbers
              </CardTitle>
              <CardDescription>
                Growing database and endless possibilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="mb-2">
                        <Icon className="h-8 w-8 mx-auto text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                How It Works
              </CardTitle>
              <CardDescription>
                From components to completed projects in four simple steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: "Add Your Components",
                    description: "Browse our database and select the electronic components you have available"
                  },
                  {
                    step: "02", 
                    title: "Set Preferences",
                    description: "Choose your skill level, time commitment, and preferred project categories"
                  },
                  {
                    step: "03",
                    title: "Generate Ideas",
                    description: "Our AI analyzes your inputs and suggests personalized, buildable project ideas"
                  },
                  {
                    step: "04",
                    title: "Build & Learn",
                    description: "Follow step-by-step instructions, save your progress, and share your results"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="flex gap-4"
                  >
                    <div className="shrink-0">
                      <Badge variant="secondary" className="h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs">
                        {item.step}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Ready to Start Building?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of students, educators, and makers who are turning their component collections 
                into amazing STEM projects. Your next great idea is just a click away!
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/components">
                  <Button variant="outline">
                    Browse Components
                  </Button>
                </Link>
                <Link href="/?scroll=generator">
                  <Button>
                    Generate Your First Idea
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}