"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const glowButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-research-500 to-research-600 text-white shadow-lg hover:shadow-research-500/25 hover:shadow-2xl hover:scale-105 active:scale-95",
        secondary: "bg-gradient-to-r from-insight-500 to-insight-600 text-white shadow-lg hover:shadow-insight-500/25 hover:shadow-2xl hover:scale-105 active:scale-95",
        accent: "bg-gradient-to-r from-analysis-500 to-analysis-600 text-white shadow-lg hover:shadow-analysis-500/25 hover:shadow-2xl hover:scale-105 active:scale-95",
        outline: "border-2 border-research-300 bg-transparent text-research-600 hover:bg-research-50 hover:border-research-400 hover:shadow-lg",
        ghost: "text-research-600 hover:bg-research-50 hover:text-research-700 hover:shadow-md",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-red-500/25 hover:shadow-2xl hover:scale-105 active:scale-95",
        neumorphic: "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] hover:shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] active:shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-13 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glowButtonVariants> {
  asChild?: boolean;
}

const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>
  (({ className, variant, size, asChild = false, children, ...props }, ref) => {
    return (
      <button
        className={cn(glowButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Glow effect overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);
GlowButton.displayName = "GlowButton";

export { GlowButton, glowButtonVariants };

