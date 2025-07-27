import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("p-6 pt-0", className)} {...props} />;
}

// Glassmorphism card component for consistent styling across the app
function GlassCard({ className, children, ...props }: React.ComponentProps<"div"> & { children: React.ReactNode }) {
  return (
    <Card
      className={cn(
        "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

export { Card, CardContent, GlassCard };
