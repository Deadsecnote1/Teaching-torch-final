import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Input = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "flex w-full px-4 py-2.5 rounded-lg border border-border bg-bg-secondary text-text-primary placeholder:text-text-muted",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-danger focus:ring-danger",
          className
        )}
        {...props}
      />
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-danger"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
