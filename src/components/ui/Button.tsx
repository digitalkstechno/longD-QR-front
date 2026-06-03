import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'brand-gradient text-white hover:opacity-90 shadow-sm',
      secondary: 'bg-bg-card text-white hover:bg-opacity-80 border border-border-subtle',
      outline: 'border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
      ghost: 'text-text-muted hover:text-white hover:bg-white/5',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2',
      lg: 'px-6 py-3 text-lg font-medium',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none font-medium',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
