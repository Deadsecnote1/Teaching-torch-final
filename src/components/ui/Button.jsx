import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 focus-ring active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
        secondary: 'bg-bg-secondary text-text-primary border border-border hover:bg-bg-tertiary',
        outline: 'border border-primary text-primary hover:bg-primary-light',
        ghost: 'text-primary hover:bg-bg-secondary',
        danger: 'bg-danger text-white hover:opacity-90 shadow-sm',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
        icon: 'p-2',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const Button = forwardRef(({ className, variant, size, fullWidth, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(buttonVariants({ variant, size, fullWidth }), className)}
    {...props}
  />
));

Button.displayName = 'Button';
export { Button, buttonVariants };
