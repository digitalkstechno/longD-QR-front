import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'outline';
}

export const Badge = ({ className, variant = 'info', ...props }: BadgeProps) => {
  const variants = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    info: 'bg-info/10 text-info border-info/20',
    gold: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    outline: 'border-border-subtle text-text-muted',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border transition-colors duration-200 uppercase tracking-wider',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
