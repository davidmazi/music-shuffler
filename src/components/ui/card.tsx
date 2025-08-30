import * as React from "react";
import { cn } from "@/lib/utils";

// Base Card Component
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground rounded-xl border border-border/50 shadow-sm transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

// Card Content Component
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6", className)}
      {...props}
    />
  );
}

// Card Header Component
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col space-y-1.5 p-6 pb-0", className)}
      {...props}
    />
  );
}

// Card Title Component
function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

// Card Description Component
function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

// Card Footer Component
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

// Enhanced Glassmorphism Card
function GlassCard({
  className,
  children,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "subtle";
}) {
  const variants = {
    default: "glass-card shadow-xl",
    elevated: "glass-card shadow-2xl border-white/20",
    subtle: "glass-card shadow-lg border-white/10"
  };

  return (
    <Card
      className={cn(
        variants[variant],
        "backdrop-blur-xl transition-all duration-300 hover:shadow-2xl",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

// Sleek Gradient Card
function GradientCard({
  className,
  children,
  gradient = "primary",
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
  gradient?: "primary" | "secondary" | "card";
}) {
  const gradients = {
    primary: "gradient-primary",
    secondary: "gradient-secondary",
    card: "gradient-card"
  };

  return (
    <Card
      className={cn(
        gradients[gradient],
        "border-0 shadow-xl transition-all duration-300 hover:shadow-2xl",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

// Interactive Card with hover effects
function InteractiveCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-lg",
        "active:scale-[0.98]",
        "focus-ring",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

// Music Card specifically for music items
function MusicCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "bg-gradient-to-br from-card via-card/95 to-card/90",
        "border border-border/30 shadow-lg",
        "backdrop-blur-sm",
        "transition-all duration-300",
        "hover:shadow-xl hover:border-border/50",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

export {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  GlassCard,
  GradientCard,
  InteractiveCard,
  MusicCard
};
