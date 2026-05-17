import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Select = forwardRef(({ className, label, options, error, placeholder = "Select option...", ...props }, ref) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "flex w-full px-4 py-2.5 rounded-lg border border-border bg-bg-secondary text-text-primary",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed appearance-none",
          error && "border-danger focus:ring-danger",
          className
        )}
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', 
          backgroundPosition: 'right 0.75rem center', 
          backgroundRepeat: 'no-repeat', 
          backgroundSize: '1.5em 1.5em', 
          paddingRight: '2.5rem' 
        }}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options?.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
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

Select.displayName = 'Select';
