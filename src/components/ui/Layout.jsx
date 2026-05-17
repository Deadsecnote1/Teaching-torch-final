import React from 'react';
import { cn } from '../../utils/cn';

export const Container = ({ children, className = '', ...props }) => (
  <div className={cn("container-modern", className)} {...props}>
    {children}
  </div>
);

export const Section = ({ children, className = '', title, description, ...props }) => (
  <section className={cn("py-12 sm:py-16 md:py-20", className)} {...props}>
    <Container>
      {(title || description) && (
        <div className="mb-10 sm:mb-12 text-center max-w-3xl mx-auto">
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-lg text-text-muted">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </Container>
  </section>
);

export const Grid = ({ children, cols = 3, gap = 6, className = '', centerIncomplete = false, ...props }) => {
  const gapClass = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
  }[gap] || 'gap-6';

  if (centerIncomplete) {
    const itemClass = {
      3: 'w-full max-w-sm sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]',
      4: 'w-full max-w-xs sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)]',
    }[cols] || 'w-full max-w-sm';

    return (
      <div className={cn('flex flex-wrap justify-center', gapClass, className)} {...props}>
        {React.Children.map(children, (child) =>
          child != null ? (
            <div key={child.key} className={cn(itemClass, 'flex justify-center')}>
              {child}
            </div>
          ) : null
        )}
      </div>
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[cols] || 'grid-cols-1';

  return (
    <div className={cn('grid', gridCols, gapClass, className)} {...props}>
      {children}
    </div>
  );
};