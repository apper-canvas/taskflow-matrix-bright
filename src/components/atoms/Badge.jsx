import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children,
  variant = "default",
  size = "md",
  className,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-neutral-100 text-neutral-700 border border-neutral-200",
    primary: "bg-primary-100 text-primary-700 border border-primary-200",
    success: "bg-accent-100 text-accent-700 border border-accent-200",
    warning: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    danger: "bg-red-100 text-red-700 border border-red-200",
    work: "bg-blue-100 text-blue-700 border border-blue-200",
    personal: "bg-purple-100 text-purple-700 border border-purple-200",
    urgent: "bg-red-100 text-red-700 border border-red-200"
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2"
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;