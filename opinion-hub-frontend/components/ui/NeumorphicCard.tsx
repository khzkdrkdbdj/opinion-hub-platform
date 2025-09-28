"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const NeumorphicCard = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "pressed" | "elevated";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] bg-gradient-to-br from-gray-50 to-gray-100",
    pressed: "shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff] bg-gradient-to-br from-gray-100 to-gray-50",
    elevated: "shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff] bg-gradient-to-br from-white to-gray-50",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border-0 transition-all duration-300 hover:shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
NeumorphicCard.displayName = "NeumorphicCard";

const NeumorphicCardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6", className)}
    {...props}
  />
));
NeumorphicCardHeader.displayName = "NeumorphicCardHeader";

const NeumorphicCardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight bg-gradient-to-r from-research-600 to-analysis-600 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
));
NeumorphicCardTitle.displayName = "NeumorphicCardTitle";

const NeumorphicCardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 leading-relaxed", className)}
    {...props}
  />
));
NeumorphicCardDescription.displayName = "NeumorphicCardDescription";

const NeumorphicCardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
NeumorphicCardContent.displayName = "NeumorphicCardContent";

const NeumorphicCardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
NeumorphicCardFooter.displayName = "NeumorphicCardFooter";

export { 
  NeumorphicCard, 
  NeumorphicCardHeader, 
  NeumorphicCardFooter, 
  NeumorphicCardTitle, 
  NeumorphicCardDescription, 
  NeumorphicCardContent 
};

