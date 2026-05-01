import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

// Base card container
const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
));
Card.displayName = "Card";

// Card header
const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// Card title
const CardTitle = forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

// Optional description
const CardDescription = forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = "CardDescription";

// Main content wrapper
const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0 pb-2", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

// Footer section (actions or info)
const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Export all components
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
