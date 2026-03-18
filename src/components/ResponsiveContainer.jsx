
import React from 'react';
import { cn } from '@/lib/utils';

const ResponsiveContainer = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "w-full mx-auto px-4 sm:px-6 md:px-8 max-w-7xl",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
