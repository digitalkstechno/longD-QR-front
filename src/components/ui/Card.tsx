import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
}

export const Card = ({ className, glass = false, hover = false, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'admin-card p-6 overflow-hidden',
        hover && 'admin-card-hover',
        className
      )}
      {...props}
    />
  );
};
