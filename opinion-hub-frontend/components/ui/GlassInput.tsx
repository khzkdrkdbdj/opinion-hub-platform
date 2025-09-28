"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700 block">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-xl border-0 bg-white/70 backdrop-blur-sm px-4 py-3 text-sm shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] ring-1 ring-gray-200/50 transition-all duration-200",
              "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-research-400/50 focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),0_0_0_3px_rgba(14,165,233,0.1)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error && "ring-red-300 focus:ring-red-400/50",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span className="text-red-500">⚠</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);
GlassInput.displayName = "GlassInput";

export { GlassInput };

