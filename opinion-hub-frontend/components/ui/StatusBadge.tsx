"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 shadow-sm",
  {
    variants: {
      variant: {
        active: "border-green-200 bg-gradient-to-r from-green-50 to-green-100 text-green-700 shadow-green-100/50",
        closed: "border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 shadow-gray-100/50",
        upcoming: "border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-blue-100/50",
        success: "border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 shadow-emerald-100/50",
        warning: "border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 shadow-amber-100/50",
        error: "border-red-200 bg-gradient-to-r from-red-50 to-red-100 text-red-700 shadow-red-100/50",
        info: "border-research-200 bg-gradient-to-r from-research-50 to-research-100 text-research-700 shadow-research-100/50",
        premium: "border-analysis-200 bg-gradient-to-r from-analysis-50 to-analysis-100 text-analysis-700 shadow-analysis-100/50",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  icon?: React.ReactNode;
  pulse?: boolean;
}

function StatusBadge({ 
  className, 
  variant, 
  size, 
  icon, 
  pulse = false, 
  children, 
  ...props 
}: StatusBadgeProps) {
  return (
    <div
      className={cn(
        statusBadgeVariants({ variant, size }),
        pulse && "animate-pulse-slow",
        className
      )}
      {...props}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants };

