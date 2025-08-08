import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className,
  type = "text",
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white";
  
  const states = {
    default: "border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20",
    error: "border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50"
  };
  
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        baseStyles,
        error ? states.error : states.default,
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;