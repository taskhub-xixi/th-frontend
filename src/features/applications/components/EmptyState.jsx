"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import Link from "next/link";

const EmptyState = ({ title, description, buttonText, buttonLink }) => (
  <Card className="border-border bg-gradient-to-b from-secondary/30 to-secondary/50">
    <CardContent className="py-12 md:py-16 flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 md:w-32 md:h-32 mb-6 relative">
        <div className="absolute inset-0 bg-secondary rounded-2xl" />
        <div className="absolute inset-4 bg-background rounded-xl shadow-sm flex flex-col items-center justify-center">
          <div className="w-10 h-6 md:w-12 md:h-8 border-2 border-border rounded mb-2" />
          <div className="flex gap-1">
            <div className="w-6 h-2 md:w-8 md:h-2 bg-border rounded" />
            <div className="w-6 h-2 md:w-8 md:h-2 bg-border rounded" />
          </div>
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 md:w-20 h-5 md:h-6 bg-muted rounded-full flex items-center justify-center">
          <Briefcase className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </div>
      </div>
      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 text-sm md:text-base">{description}</p>
      <Button asChild className="text-xs md:text-sm" size="sm">
        <Link href={buttonLink}>{buttonText}</Link>
      </Button>
    </CardContent>
  </Card>
);

export default EmptyState;