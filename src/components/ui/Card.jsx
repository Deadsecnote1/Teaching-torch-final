import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Card = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('card-modern flex flex-col', className)} {...props} />
));
Card.displayName = 'Card';

export const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 py-4 border-b border-border flex flex-col gap-1', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-lg font-semibold text-text-primary leading-none', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-text-muted', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 flex-1', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 py-4 border-t border-border flex items-center', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';
