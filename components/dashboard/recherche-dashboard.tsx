"use client";

import { useState } from "react";

import { ResearchAxesPage } from "@/components/dashboard/research-axes-page";
import { ResearchProjectsPage } from "@/components/dashboard/research-projects-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function RechercheDashboard() {
  const [tab, setTab] = useState("axes");

  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-6">
      <TabsList>
        <TabsTrigger value="axes">Axes de recherche</TabsTrigger>
        <TabsTrigger value="projets">Projets en cours</TabsTrigger>
      </TabsList>

      <TabsContent value="axes">
        <ResearchAxesPage />
      </TabsContent>

      <TabsContent value="projets">
        <ResearchProjectsPage />
      </TabsContent>
    </Tabs>
  );
}
