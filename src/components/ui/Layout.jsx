import React from 'react';
import { cn } from '../../utils/cn';

export const Container = ({ children, className = '', ...props }) => (
  <div className={cn('container-modern', className)} {...props}>
    {children}
  </div>
);

export const Section = ({ children, className = '', title, description, ...props }) => (
  <section className={cn('py-12 sm:py-16 md:py-20', className)} {...props}>
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

/** Tailwind-safe col-start classes for centering a partial last row (max breakpoint only). */
const incompleteRowColStart = {
  3: {
    1: 'lg:col-start-2',
    2: 'lg:col-start-1',
  },
  4: {
    1: 'xl:col-start-2',
    2: 'xl:col-start-2',
    3: 'xl:col-start-1',
  },
};

export const Grid = ({ children, cols = 3, gap = 6, className = '', centerIncomplete = false, ...props }) => {
  const gapClass = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
  }[gap] || 'gap-6';

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[cols] || 'grid-cols-1';

  const childArray = React.Children.toArray(children).filter((child) => child != null);
  const remainder = centerIncomplete && cols > 1 ? childArray.length % cols : 0;
  const colStartForRemainder = incompleteRowColStart[cols]?.[remainder] || '';

  return (
    <div className={cn('grid', gridCols, gapClass, className)} {...props}>
      {childArray.map((child, index) => {
        const isFirstOfIncompleteRow =
          centerIncomplete && remainder > 0 && index === childArray.length - remainder;

        if (!isFirstOfIncompleteRow || !colStartForRemainder) {
          return child;
        }

        return React.cloneElement(child, {
          className: cn(child.props.className, colStartForRemainder),
        });
      })}
    </div>
  );
};
