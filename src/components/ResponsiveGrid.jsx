
import React from 'react';
import { cn } from '@/lib/utils';

const ResponsiveGrid = ({ children, className, columns = 3, ...props }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div 
      className={cn(
        "grid gap-4 md:gap-6 lg:gap-8",
        gridCols[columns] || gridCols[3],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
