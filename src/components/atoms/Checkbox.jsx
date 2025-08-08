import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Checkbox = forwardRef(({ 
  className,
  checked,
  onChange,
  disabled,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "task-checkbox",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      />
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;