import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'standard' | 'action' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'standard', size = 'md', ...props }, ref) => {
    const base = 'flex items-center justify-center border-none bg-transparent cursor-pointer rounded-md transition-all duration-150 active:scale-[0.92]';
    
    const sizes = {
      sm: 'w-[30px] h-[30px]', // Modal close button size
      md: 'w-9 h-9',           // Toolbar button size
      lg: 'w-10 h-10',
    };

    const variants = {
      standard: 'text-text-secondary hover:bg-hover-bg hover:text-text-body',
      action: 'text-text-secondary hover:bg-hover-bg hover:text-text-body', // Similar to standard but semantic
      danger: 'text-text-secondary hover:bg-danger-bg hover:text-danger',
      ghost: 'text-text-muted hover:bg-hover-bg hover:text-text-body rounded-sm', // Useful for modal close
    };

    return (
      <button
        ref={ref}
        className={cn(base, sizes[size], variants[variant], className)}
        {...props}
      />
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton };
